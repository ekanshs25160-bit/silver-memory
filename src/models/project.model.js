import mongoose,{Schema} from "mongoose";

const projectSchema = new Schema(
    {
        name:{
            type: String,
            required: [true, "Project name is required"],
            trim: true,
            index: true
        },

        description: {
            type: String,
            trim: true
        },

        owner: {
            name: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Project = mongoose.model("Project", projectSchema)