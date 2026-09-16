import { Router } from "express";
import { createTask } from "../controllers/task.controller.js";
import { verifyJWT, verifyUserRole } from "../middlewares/auth.middleware.js";
import { UserRoleEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:projectId")
  .post(
    verifyUserRole([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    createTask,
  );

export default Router;
