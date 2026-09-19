import { Router } from "express";
import { verifyJWT, verifyUserRole } from "../middlewares/auth.middleware.js";
import { UserRoleEnum } from "../utils/constants.js";
import {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
  getNoteById,
} from "../controllers/note.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:projectId")
  .get(getNotes)
  .post(verifyUserRole([UserRoleEnum.ADMIN]), createNote);

router
  .route("/:projectId/n/:notesId")
  .get(getNoteById)
  .put(verifyUserRole([UserRoleEnum.ADMIN]), updateNote)
  .delete(verifyUserRole([UserRoleEnum.ADMIN]), deleteNote);

export default router