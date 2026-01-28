import Rental from "../models/Rental.js";

// Recommendation algorithm based on user preferences
export const getRecommendations = async (req, res) => {
  try {
    const {
      max_budget,
      required_amenities = [],
      gender_preference,
      sharing_type,
      property_type,
      location,
      min_rating = 0,
      limit = 10,
    } = req.body;

    // Build filter query
    let filter = {};

    if (max_budget) {
      filter.price = { $lte: max_budget };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (gender_preference) {
      filter.gender_preference = { $in: [gender_preference, "unisex"] };
    }

    if (sharing_type) {
      filter.sharing_type = sharing_type;
    }

    if (property_type) {
      filter.property_type = property_type;
    }

    if (min_rating > 0) {
      filter.rating = { $gte: min_rating };
    }

    // Filter by amenities - must have all required amenities
    if (required_amenities.length > 0) {
      const amenityFilters = required_amenities.map((amenity) => ({
        [`amenities.${amenity}`]: true,
      }));
      filter.$and = amenityFilters;
    }

    // Get filtered rentals
    let candidates = await Rental.find(filter);

    // Calculate recommendation scores
    candidates = candidates.map((rental) => {
      let score = 0;

      // Price score (lower is better, max 25 points)
      if (max_budget) {
        const priceScore = Math.max(0, (1 - rental.price / max_budget) * 25);
        score += priceScore;
      } else {
        score += 20;
      }

      // Rating score (max 30 points)
      score += (rental.rating || 0) * 6;

      // Amenity match score (max 25 points)
      let amenityMatch = 0;
      if (required_amenities && required_amenities.length > 0) {
        required_amenities.forEach((amenity) => {
          if (rental.amenities && rental.amenities[amenity]) {
            amenityMatch += 1;
          }
        });
        score += (amenityMatch / required_amenities.length) * 25;
      } else {
        // If no specific amenities required, give bonus points based on how many amenities are available
        const availableAmenities = Object.values(rental.amenities || {}).filter(v => v === true).length;
        score += Math.min(availableAmenities, 8) * 2; // Max 16 points
      }

      // Vacancy score (max 15 points)
      if (rental.vacancies > 0) {
        score += Math.min(rental.vacancies, 5) * 3;
      } else {
        score += 0; // No vacancy means no bonus
      }

      // Capacity match score (max 5 points)
      if (rental.capacity >= 2) {
        score += 5;
      }

      return {
        ...rental.toObject(),
        score: parseFloat(score.toFixed(2)),
        recommendation_score: parseFloat(score.toFixed(2)),
      };
    });

    // Sort by recommendation score
    candidates.sort((a, b) => b.recommendation_score - a.recommendation_score);

    // Return top recommendations
    const recommendations = candidates.slice(0, limit);

    res.json({
      message: "Recommendations retrieved successfully",
      count: recommendations.length,
      total_available: candidates.length,
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res
      .status(500)
      .json({ message: "Error generating recommendations", error: error.message });
  }
};

// Get all rentals with optional filters
export const getAllRentals = async (req, res) => {
  try {
    const { location, property_type, sort_by = "price" } = req.query;
    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (property_type) {
      filter.property_type = property_type;
    }

    const rentals = await Rental.find(filter).sort({ [sort_by]: 1 });

    res.json({
      message: "Rentals retrieved successfully",
      count: rentals.length,
      rentals,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving rentals", error: error.message });
  }
};

// Get rental by ID
export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 getRentalById called with ID: ${id}`);
    
    const rental = await Rental.findById(id);
    console.log(`📦 Query result:`, rental ? `Found rental ${rental.name}` : "No rental found");

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.json({
      message: "Rental retrieved successfully",
      rental,
    });
  } catch (error) {
    console.error(`❌ Error in getRentalById:`, error);
    res.status(500).json({ message: "Error retrieving rental", error: error.message });
  }
};

// Mark rental as selected/favorited
export const toggleRentalSelection = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findOne({ id });

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    rental.is_selected = !rental.is_selected;
    await rental.save();

    res.json({
      message: `Rental ${rental.is_selected ? "selected" : "deselected"} successfully`,
      rental,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating rental", error: error.message });
  }
};

// Get trending/popular rentals
export const getTrendingRentals = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trending = await Rental.find()
      .sort({ rating: -1, is_selected: -1 })
      .limit(parseInt(limit));

    res.json({
      message: "Trending rentals retrieved",
      count: trending.length,
      rentals: trending,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving trending rentals", error: error.message });
  }
};
