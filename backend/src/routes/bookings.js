import express from "express";
import {
  createBooking,
  getOwnerBookings,
  getRenterBookings,
  getBooking,
  acceptBooking,
  rejectBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Protected routes (all require authentication)
router.post("/", authenticateToken, createBooking);
router.get("/owner/requests", authenticateToken, getOwnerBookings);
router.get("/renter/bookings", authenticateToken, getRenterBookings);
router.get("/:bookingId", authenticateToken, getBooking);
router.put("/:bookingId/accept", authenticateToken, acceptBooking);
router.put("/:bookingId/reject", authenticateToken, rejectBooking);
router.put("/:bookingId/cancel", authenticateToken, cancelBooking);

export default router;
