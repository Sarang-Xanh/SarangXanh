import express from "express";
import { register, login, logout, refreshToken, getUser } from "../Controllers/AuthController.js";
import { verifyUser } from "../Middleware/verifyUser.js";

const router = express.Router();

// 🔑 Auth endpoints
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", verifyUser, getUser);
router.post("/refresh-token", refreshToken);

export default router;
