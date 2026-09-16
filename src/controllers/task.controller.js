import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
import { TaskStatusEnum } from "../utils/constants.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { SubTask } from "../models/subtask.model.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Title is needed for task");
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo: assignedTo || null,
    status: status || TaskStatusEnum.TODO,
    createdBy: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, task, "Task is created"));
});

export const getTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const tasks = await Task.find({ project: projectId })
    .populate("assignedTo", "name email username")
    .populate("createdBy", "name email username");
  return res.status(200).json(new ApiResponse(200, tasks, "All tasks fetched"));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Task ID");
  }
  const task = await Task.findOne({ _id: taskId, project: projectId })
    .populate("assignedTo", "name email username")
    .populate("createdBy", "name email username");
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  const subtasks = await SubTask.find({ task: taskId });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { task, subtasks }, "Task fetched successfully"),
    );
});
