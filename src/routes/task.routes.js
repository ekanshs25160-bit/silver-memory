import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTaskById,
  updateTask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from "../controllers/task.controller.js";
import { verifyJWT, verifyUserRole } from "../middlewares/auth.middleware.js";
import { UserRoleEnum } from "../utils/constants.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:projectId")
  .post(
    verifyUserRole([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    upload.array('attachments', 5),
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

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    verifyUserRole([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    createSubtask,
  );

router
  .route("/:projectId/st/:subTaskId")
  .put(updateSubtask)
  .delete(
    verifyUserRole([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    deleteSubtask,
  );

export default router;
