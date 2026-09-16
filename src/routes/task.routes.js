import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTaskById,
  updateTask,
} from "../controllers/task.controller.js";
import { verifyJWT, verifyUserRole } from "../middlewares/auth.middleware.js";
import { UserRoleEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:projectId")
  .post(
    verifyUserRole([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    createTask,
  )
  .get(getTask);

router
  .route("/:projectId/t/:taskId")
  .get(getTaskById)
  .put(
    verifyUserRole([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    updateTask,
  )
  .delete(
    verifyUserRole([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    deleteTask,
  );

export default router;
