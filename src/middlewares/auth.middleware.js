import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ProjectMember } from "../models/projectmember.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request: No token provided");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token: User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid access token')
  }
});

export const verifyUserRole = (roles=[])=>{return asyncHandler(async(req,res,next)=>{
  const {projectId} = req.params
  if(!projectId){
    throw new ApiError(400, 'Project ID is required')
  }
  const project = await ProjectMember.findOne({
    project: projectId,
    user: req.user._id
  })
  if(!project){
    throw new ApiError(400, 'No project found')
  }
  const givenRole = project?.role
  if(!roles.includes(project.role)){
    throw new ApiError(403,'No permission to access the project')
  }
  next()
})}