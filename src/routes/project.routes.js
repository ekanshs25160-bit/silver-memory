import { Router } from "express";
import { verifyJWT,verifyUserRole } from "../middlewares/auth.middleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMembersToProject,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
} from "../controllers/project.controller.js";
import { AvailableUser, UserRoleEnum } from "../utils/constants.js";
import { User } from "../models/user.model.js";

const router = Router();

router.use(verifyJWT)

router.route("/").post(createProject).get(getProjects);

router
  .route("/:projectId")
  .get(verifyUserRole(AvailableUser),getProjectById)
  .put(verifyUserRole([UserRoleEnum.ADMIN]),updateProject)
  .delete(verifyUserRole([UserRoleEnum.ADMIN]),deleteProject);

router
  .route("/:projectId/members")
  .get(verifyUserRole(AvailableUser),getProjectMembers)
  .post(verifyUserRole([UserRoleEnum.ADMIN]), addMembersToProject);
router
  .route("/:projectId/members/:userId")
  .put(verifyUserRole([UserRoleEnum.ADMIN]), updateMemberRole)
  .delete(verifyUserRole([UserRoleEnum.ADMIN]), deleteMember);
export default router;
