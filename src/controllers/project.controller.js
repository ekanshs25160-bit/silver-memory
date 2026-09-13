import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { AvailableUser } from "../utils/constants.js";
import { ProjectMember } from "../models/projectmember.model.js";

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, owner } = req.body;
  if (!name || name.trim() === "") {
    throw new ApiError(400, "Project name is required");
  }
  const project = await Project.create({
    name: name,
    description: description,
    owner,
  });
  return res
    .status(201)
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
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated Successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid Project ID format");
  }
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted Successfully"));
});

export const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await ProjectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user.id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user.id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Project Member added successfully"));
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid Project ID format");
  }
  
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const members = await ProjectMember.find({ project: projectId }).populate(
    "user",
    "name email username",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, members, "Project members fetched successfully"),
    );
});
export const updateMemberRole = asyncHandler(async (req, res) => res.json({}));
export const deleteMember = asyncHandler(async (req, res) => res.json({}));
