import { Router } from "express";
import * as authController from "../controllers/auth-controller";

const router = Router();

router.route("/signup").post(authController.registerUser);
router.route("/signin").post(authController.loginUser);
router.route("/google").post(authController.loginWithGoogle);

export default router;
