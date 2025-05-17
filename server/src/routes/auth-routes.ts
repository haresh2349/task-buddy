import { Router } from "express";
import * as authController from "../controllers/auth-controller";

const router = Router();

router.route("/signup").post(authController.registerUser);
router.route("/signin").post(authController.loginUser);
router.route("/google").post(authController.loginWithGoogle);
// // For Sign IN with Google
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/dashboard",
//     failureRedirect: "http://localhost:3000/login",
//   })
// );

// router.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("http://localhost:3000/");
//   });
// });

export default router;
