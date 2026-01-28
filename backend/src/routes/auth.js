import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUser);
router.put("/profile", authenticateToken, updateProfile);
router.get("/all-users", authenticateToken, getAllUsers);
router.delete("/users/:userId", authenticateToken, deleteUser);

export default router;
