import express from "express";
import {
  getRecommendations,
  getAllRentals,
  getRentalById,
  toggleRentalSelection,
  getTrendingRentals,
  trackCityClick,
  getCityClickStats,
  exportCityClicksCSV,
} from "../controllers/rentalController.js";
import {
  getPropertyReviews,
  addPropertyReview,
  deletePropertyReview,
} from "../controllers/propertyController.js";
import { authenticateToken } from "../middleware/auth.js";
import Property from "../models/Property.js"; // Import Property model

const router = express.Router();

// City counts route - MUST be before /:id route
router.get("/city-counts", async (req, res) => {
  try {
    // Aggregate properties by city and count them
    const cityCounts = await Property.aggregate([
      {
        // Group by city (case-insensitive by converting to lowercase)
        $group: {
          _id: { $toLower: "$city" },
          count: { $sum: 1 }
        }
      },
      {
        // Sort by count in descending order
        $sort: { count: -1 }
      },
      {
        // Format the output with proper capitalization
        $project: {
          _id: 0,
          city: {
            $concat: [
              { $toUpper: { $substrCP: ["$_id", 0, 1] } },
              { $substrCP: ["$_id", 1, { $strLenCP: "$_id" }] }
            ]
          },
          count: 1
        }
      }
    ]);

    console.log("City counts response:", cityCounts); // Debug log
    res.json(cityCounts);
  } catch (error) {
    console.error("Error fetching city counts:", error);
    res.status(500).json({ 
      message: "Failed to fetch city counts",
      error: error.message 
    });
  }
});

// Public routes
router.post("/recommend", getRecommendations);
router.post("/track-city-click", trackCityClick); // Track city clicks
router.get("/city-click-stats", getCityClickStats); // Get city click statistics
router.get("/export-city-clicks", exportCityClicksCSV); // Export city clicks as CSV
router.get("/", getAllRentals);
router.get("/trending", getTrendingRentals);
router.put("/:id/select", authenticateToken, toggleRentalSelection);
router.get("/:id", getRentalById);

// Review routes (using unified Property model)
router.get("/:id/reviews", getPropertyReviews);
router.post("/:id/reviews", authenticateToken, addPropertyReview);
router.delete("/:id/reviews/:reviewId", authenticateToken, deletePropertyReview);

export default router;