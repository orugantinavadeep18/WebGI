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
import Property from "../models/Property.js";

const router = express.Router();

// ⚠️ IMPORTANT: Specific routes MUST come BEFORE parameterized routes (/:id)

// City counts route - MUST be before /:id route
router.get("/city-counts", async (req, res) => {
  try {
    console.log("📊 City counts endpoint called");
    
    // Aggregate properties by city and count them
    const cityCounts = await Property.aggregate([
      {
        // Filter out properties with empty or null city names
        $match: {
          city: { $exists: true, $ne: "", $ne: null }
        }
      },
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

    console.log("✅ City counts result:", cityCounts);
    res.json(cityCounts);
  } catch (error) {
    console.error("❌ Error fetching city counts:", error);
    res.status(500).json({ 
      message: "Failed to fetch city counts",
      error: error.message 
    });
  }
});

// Trending route - also before /:id
router.get("/trending", getTrendingRentals);

// Other public routes
router.post("/recommend", getRecommendations);
router.get("/", getAllRentals);

// Parameterized routes come AFTER specific routes
router.get("/:id", getRentalById);
router.put("/:id/select", authenticateToken, toggleRentalSelection);

// Review routes (using unified Property model)
router.get("/:id/reviews", getPropertyReviews);
router.post("/:id/reviews", authenticateToken, addPropertyReview);
router.delete("/:id/reviews/:reviewId", authenticateToken, deletePropertyReview);

export default router;
