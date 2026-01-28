import Property from "../models/Property.js";

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
      filter.$or = [
        { location: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
      ];
    }

    if (gender_preference) {
      filter.gender_preference = { $in: [gender_preference, "unisex"] };
    }

    if (sharing_type) {
      filter.sharing_type = sharing_type;
    }

    if (property_type) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { property_type: property_type },
        { propertyType: property_type }
      );
    }

    if (min_rating > 0) {
      filter.rating = { $gte: min_rating };
    }

    // Filter by amenities - must have all required amenities
    if (required_amenities.length > 0) {
      const amenityFilters = required_amenities.map((amenity) => ({
        [`amenities_object.${amenity}`]: true,
      }));
      filter.$and = amenityFilters;
    }

    // Get filtered properties
    let candidates = await Property.find(filter);

    // Calculate recommendation scores
    candidates = candidates.map((property) => {
      let score = 0;

      // Price score (lower is better, max 25 points)
      if (max_budget) {
        const priceScore = Math.max(0, (1 - property.price / max_budget) * 25);
        score += priceScore;
      } else {
        score += 20;
      }

      // Rating score (max 30 points)
      score += (property.rating || 0) * 6;

      // Amenity match score (max 25 points)
      let amenityMatch = 0;
      if (required_amenities && required_amenities.length > 0) {
        required_amenities.forEach((amenity) => {
          if (property.amenities_object && property.amenities_object[amenity]) {
            amenityMatch += 1;
          }
        });
        score += (amenityMatch / required_amenities.length) * 25;
      } else {
        // If no specific amenities required, give bonus points based on how many amenities are available
        const availableAmenities = Object.values(property.amenities_object || {}).filter(v => v === true).length;
        score += Math.min(availableAmenities, 8) * 2; // Max 16 points
      }

      // Vacancy score (max 15 points)
      if (property.vacancies > 0) {
        score += Math.min(property.vacancies, 5) * 3;
      } else {
        score += 0; // No vacancy means no bonus
      }

      // Capacity match score (max 5 points)
      if (property.capacity >= 2) {
        score += 5;
      }

      return {
        ...property.toObject(),
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

// Get all properties (unified endpoint)
export const getAllRentals = async (req, res) => {
  try {
    const { location, property_type, city, sort_by = "price" } = req.query;
    let filter = {};

    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
        { address: { $regex: location, $options: "i" } },
      ];
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (property_type) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { property_type: property_type },
        { propertyType: property_type }
      );
    }

    const properties = await Property.find(filter).sort({ [sort_by]: 1 });

    res.json({
      message: "Properties retrieved successfully",
      count: properties.length,
      properties,
      rentals: properties, // Include both keys for compatibility
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving properties", error: error.message });
  }
};

// Get property by ID
export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 getRentalById called with ID: ${id}`);
    
    const property = await Property.findById(id);
    console.log(`📦 Query result:`, property ? `Found property ${property.title || property.name}` : "No property found");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: "Property retrieved successfully",
      property,
      rental: property, // Include both keys for compatibility
    });
  } catch (error) {
    console.error(`❌ Error in getRentalById:`, error);
    res.status(500).json({ message: "Error retrieving property", error: error.message });
  }
};

// Mark property as selected/favorited
export const toggleRentalSelection = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.is_selected = !property.is_selected;
    await property.save();

    res.json({
      message: `Property ${property.is_selected ? "selected" : "deselected"} successfully`,
      property,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating property", error: error.message });
  }
};

// Get trending/popular properties
export const getTrendingRentals = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trending = await Property.find()
      .sort({ rating: -1, is_selected: -1 })
      .limit(parseInt(limit));

    res.json({
      message: "Trending properties retrieved",
      count: trending.length,
      properties: trending,
      rentals: trending, // Include both keys for compatibility
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving trending properties", error: error.message });
  }
};

