import mongoose,{Schema} from "mongoose";
import { AvailableUser, UserRoleEnum } from "../utils/constants.js";

const memberSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: AvailableUser,
        default: UserRoleEnum.MEMBER
    }
})

export const ProjectMember = mongoose.model("ProjectMember",memberSchema)