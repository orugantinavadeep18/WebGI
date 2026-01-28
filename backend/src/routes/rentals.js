import express from "express";
import {
  getRecommendations,
  getAllRentals,
  getRentalById,
  toggleRentalSelection,
  getTrendingRentals,
} from "../controllers/rentalController.js";
import {
  getPropertyReviews,
  addPropertyReview,
  deletePropertyReview,
} from "../controllers/propertyController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes - specific routes BEFORE wildcard routes
router.post("/recommend", getRecommendations);
router.get("/trending", getTrendingRentals);
router.get("/", getAllRentals);

// Review routes MUST come before /:id to avoid the wildcard catching /reviews
router.get("/:id/reviews", getPropertyReviews);
router.post("/:id/reviews", authenticateToken, addPropertyReview);
router.delete("/:id/reviews/:reviewId", authenticateToken, deletePropertyReview);

// ID-based routes (must be last)
router.get("/:id", getRentalById);
router.put("/:id/select", authenticateToken, toggleRentalSelection);

export default router;
