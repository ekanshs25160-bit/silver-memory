import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { SubTask } from "../models/subtask.model.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Title is needed for task");
  }

  let attachments = []

  if(req.files && req.files.length > 0){
    attachments = req.files.map((file)=>({
        url: `/images/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
    }))
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo: assignedTo || null,
    status: status || TaskStatusEnum.TODO,
    createdBy: req.user._id,
    attachments,
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

export const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid Task ID");
  }
  if (status && !AvailableTaskStatus.includes(status)) {
    throw new ApiError(400, "Invalid task status");
  }
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId },
    {
      $set: {
        title,
        description,
        assignedTo,
        status,
      },
    },
    { new: true },
  );
  if (!task) {
    throw new ApiError(404, "Task not found in this project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  await SubTask.deleteMany({ task: taskId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export const createSubtask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const { title } = req.body;

  const task = await Task.findOne({ _id: taskId, project: projectId });

  if (!task) {
    throw new ApiError(400, "Task not found");
  }

  const subtask = await SubTask.create({
    title,
    task: taskId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask crated successfully"));
});

export const updateSubtask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  const subTask = await SubTask.findByIdAndUpdate(
    subTaskId,
    {
      $set: {
        ...(title && { title }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
    },
    { new: true },
  );
  return res
    .status(201)
    .json(new ApiResponse(201, subTask, "Subtask updated successfully"));
});

export const deleteSubtask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const subTask = await SubTask.findByIdAndDelete(subTaskId);
  if(!subTask){
    throw new ApiError(404, 'Subtask not found')
  }
  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Subtask deleted successfully"));
});
