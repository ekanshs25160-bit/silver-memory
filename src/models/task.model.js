import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Project } from "./project.model.js";
import { User } from "./user.model.js";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: AvailableTaskStatus,
      default: TaskStatusEnum.TODO,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        mimetype: {
          type: String,
        },
        size: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model("Task", taskSchema);
