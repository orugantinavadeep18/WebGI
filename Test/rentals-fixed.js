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
    
    // First, let's see what we have in the database
    const sampleCities = await Property.find({ city: { $exists: true, $ne: "" } })
      .limit(20)
      .select('city');
    console.log("📝 Sample cities from DB:", sampleCities.map(p => p.city));
    
    // Aggregate properties by city (case-insensitive) and count them
    const cityCounts = await Property.aggregate([
      {
        // Filter out properties with empty or null city names
        $match: {
          city: { $exists: true, $ne: "", $ne: null }
        }
      },
      {
        // Add a lowercase version of city for grouping
        $addFields: {
          cityLower: { $toLower: "$city" }
        }
      },
      {
        // Group by lowercase city (case-insensitive grouping)
        $group: {
          _id: "$cityLower",
          count: { $sum: 1 },
          // Keep the first occurrence of the original city name
          originalCity: { $first: "$city" }
        }
      },
      {
        // Sort by count in descending order
        $sort: { count: -1 }
      },
      {
        // Format the output - use original city name with proper capitalization
        $project: {
          _id: 0,
          city: "$originalCity",
          cityLower: "$_id",
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
