import mongoose from "mongoose";
import { Notes } from "../models/note.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Provide content");
  }
  const notes = await Notes.create({
    project: projectId,
    content,
    createdBy: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, notes, "Notes for this project is made"));
});

export const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const notes = await Notes.find({ project: projectId }).populate(
    "createdBy",
    "name email username",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

export const getNoteById = asyncHandler(async (req, res) => {
  const { projectId, notesId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(notesId)) {
    throw new ApiError(400, "Note Id is not valid");
  }
  const notes = await Notes.findOne({
    _id: notesId,
    project: projectId,
  }).populate("createdBy", "name email username");
  if (!notes) {
    throw new ApiError(404, "Notes not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

export const updateNote = asyncHandler(async (req, res) => {
  const { projectId, notesId } = req.params;
  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Provide content");
  }
  const notes = await Notes.findOneAndUpdate(
    {
      _id: notesId,
      project: projectId,
    },
    {
      $set: {
        content,
      },
    },
    { new: true },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Note updated successfully"));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { notesId, projectId } = req.params;
  const notes = await Notes.findOneAndDelete({
    _id: notesId,
    project: projectId,
  });
  if (!notes) {
    throw new ApiError(404, "Notes not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"));
});
