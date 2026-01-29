import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  deleteUser,
  verifySecurityAnswer,
  resetPassword,
  getUserByEmail,
  recreateUserAccount,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/recreate-account", recreateUserAccount);
router.get("/me", authenticateToken, getCurrentUser);
router.put("/profile", authenticateToken, updateProfile);
router.get("/all-users", authenticateToken, getAllUsers);
router.get("/users/by-email", getUserByEmail);
router.delete("/users/:userId", authenticateToken, deleteUser);
router.post("/verify-security-answer", verifySecurityAnswer);
router.post("/reset-password", resetPassword);

export default router;
