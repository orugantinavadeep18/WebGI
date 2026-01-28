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

// Public routes
router.post("/recommend", getRecommendations);
router.get("/", getAllRentals);
router.get("/trending", getTrendingRentals);
router.put("/:id/select", toggleRentalSelection);
router.get("/:id", getRentalById);

// Review routes (rentals use same reviews as properties)
router.get("/:id/reviews", getPropertyReviews);
router.post("/:id/reviews", authenticateToken, addPropertyReview);
router.delete("/:id/reviews/:reviewId", authenticateToken, deletePropertyReview);

export default router;
