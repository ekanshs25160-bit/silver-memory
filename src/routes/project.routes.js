import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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

const router = Router();

router.use(verifyJWT)

router.route("/").post(createProject).get(getProjects);

router
  .route("/:projectId")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(addMembersToProject);

router
  .route("/:projectId/members/:userId")
  .put(updateMemberRole)
  .delete(deleteMember);

export default router;
