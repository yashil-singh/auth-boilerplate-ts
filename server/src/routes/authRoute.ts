// @ts-nocheck

import {
  checkSession,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyAccount,
} from "../controllers/authController";
import express from "express";
import strictVerifcation from "../middlewares/strictVerification";

const router = express.Router();

router.get("/check-session", strictVerifcation, checkSession);
router.post("/signup", signup);
router.post("/verify-account", strictVerifcation, verifyAccount);
router.post("/login", login);
router.post("/logout", strictVerifcation, logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:id/:token", resetPassword);

export default router;
