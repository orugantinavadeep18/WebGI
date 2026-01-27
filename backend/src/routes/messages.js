import express from "express";
import {
  sendMessage,
  getBookingMessages,
  getUserConversations,
  getUnreadCount,
  sendDirectMessage,
  getDirectMessages,
} from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.post("/", authenticateToken, sendMessage);
router.get("/booking/:bookingId", authenticateToken, getBookingMessages);
router.get("/conversations/all", authenticateToken, getUserConversations);
router.get("/unread/count", authenticateToken, getUnreadCount);

// Direct messaging (without booking)
router.post("/direct/send", authenticateToken, sendDirectMessage);
router.get("/direct/:userId", authenticateToken, getDirectMessages);

export default router;
