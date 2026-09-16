import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
import { TaskStatusEnum } from "../utils/constants.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const createTask = asyncHandler(async(req,res)=>{
    const {title,description,assignedTo,status} = req.body
    const {projectId} = req.params

    if(!title || title.trim() === ""){
        throw new ApiError(400, 'Title is needed for task')
    }

    const task = await Task.create({
        title,
        description,
        project: projectId,
        assignedTo: assignedTo || null,
        status: status || TaskStatusEnum.TODO,
        createdBy: req.user._id,
    })

    return res.status(201).json(new ApiResponse(201, task, 'Task is created'))
})