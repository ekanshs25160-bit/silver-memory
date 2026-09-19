import { Router } from "express";
// import { registerUser } from "../controllers/auth.controller.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  changeCurrentPassword,
  refreshAccessToken,
  verifyEmail,
  resendEmailVerification,
  forgotPasswordRequest,
  resetPassword
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/refresh-token").post(refreshAccessToken)
router.route('/verify-email/:verificationToken').get(verifyEmail)
router.route('/resend-email-verification').post(verifyJWT, resendEmailVerification)
router.route("/forgot-password").post(forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(resetPassword);
export default router;