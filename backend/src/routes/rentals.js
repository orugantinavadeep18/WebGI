import express from "express";
import {
  getRecommendations,
  getAllRentals,
  getRentalById,
  toggleRentalSelection,
  getTrendingRentals,
} from "../controllers/rentalController.js";

const router = express.Router();

// Public routes
router.post("/recommend", getRecommendations);
router.get("/", getAllRentals);
router.get("/trending", getTrendingRentals);
router.put("/:id/select", toggleRentalSelection);
router.get("/:id", getRentalById);

export default router;
