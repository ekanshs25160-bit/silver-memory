import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password, role } = req.body;
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with username or email already exist");
  }
  const user = await User.create({
    name,
    email,
    username,
    password,
  });
  const createUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(new ApiResponse(201, createUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email not found");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(400, "User not found");
  }

  const isPassword = await existingUser.isPasswordCorrect(password)
});
