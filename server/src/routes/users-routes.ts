import { Router } from "express";
import * as UserController from "../controllers/user-controller";
const router = Router();

router.route("/:id").get(UserController.getUserDetails);
export default router;
