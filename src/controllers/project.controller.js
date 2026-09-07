import { Project } from "../models/project.model";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || name.trim() === "") {
    throw new ApiError(400, "Project name is required");
  }
  const project = await Project.create({
    name: name,
    description: description,
  });
  return res
    .status(200)
    .json(new ApiResponse(201, project, "Project created Sucessfully"));
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid Project ID format");
  }
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid Project ID format");
  }
  if (!name || name.trim() === "") {
    throw new ApiError(400, "Project name is required");
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name: name,
      description: description,
    },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res.status(200).json(new ApiResponse(200, project, "Project updated Successfully"))
});


export const deleteProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid Project ID format");
  }
  const project = await Project.findByIdAndDelete(projectId)
  if (!project){
    throw new ApiError(404, "Project not found");
  }

  return res.status(200).json(new ApiResponse(200, project, "Project deleted Successfully"))

})