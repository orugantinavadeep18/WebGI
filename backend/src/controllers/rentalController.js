import Property from "../models/Property.js";
import CityClick from "../models/CityClick.js";

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
      min_capacity = 1,
      min_vacancies = 0,
      limit = 10,
    } = req.body;

    console.log("🔍 RECOMMENDATION REQUEST:");
    console.log("  Max Budget:", max_budget);
    console.log("  Location:", location);
    console.log("  Gender Preference:", gender_preference);
    console.log("  Sharing Type:", sharing_type);
    console.log("  Property Type:", property_type);
    console.log("  Min Capacity:", min_capacity);
    console.log("  Min Vacancies:", min_vacancies);
    console.log("  Required Amenities:", required_amenities);

    // Build filter query - be flexible with missing fields
    let filter = {};

    if (max_budget) {
      filter.price = { $lte: max_budget };
    }

    if (location && location.toLowerCase() !== "all") {
      filter.$or = [
        { location: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
        { address: { $regex: location, $options: "i" } },
      ];
    }

    if (gender_preference && gender_preference !== "all") {
      filter.gender_preference = { $in: [gender_preference, "unisex"] };
    }

    if (sharing_type && sharing_type !== "all") {
      filter.sharing_type = sharing_type;
    }

    if (property_type && property_type !== "all") {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { property_type: property_type },
        { propertyType: property_type }
      );
    }

    if (min_rating > 0) {
      filter.rating = { $gte: min_rating };
    }

    // Be flexible with capacity - if not specified or doesn't exist, include anyway
    if (min_capacity > 1) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { capacity: { $gte: min_capacity } },
        { capacity: { $exists: false } }, // Include properties without capacity field
        { bedrooms: { $gte: min_capacity } } // Fallback to bedrooms
      );
    }

    // Be flexible with vacancies - if not specified, include anyway
    if (min_vacancies > 0) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { vacancies: { $gte: min_vacancies } },
        { vacancies: { $exists: false } } // Include properties without vacancies field
      );
    }

    // Filter by amenities - optional, don't exclude if missing
    if (required_amenities.length > 0) {
      const amenityFilters = required_amenities.map((amenity) => ({
        [`amenities_object.${amenity}`]: true,
      }));
      filter.$and = amenityFilters;
    }

    // Get filtered properties
    let candidates = await Property.find(filter);
    console.log(`📊 Found ${candidates.length} candidate properties after filtering`);

    // Calculate recommendation scores
    candidates = candidates.map((property) => {
      let score = 0;

      // Price score (lower is better, max 25 points)
      if (max_budget && property.price) {
        const priceScore = Math.max(0, (1 - property.price / max_budget) * 25);
        score += priceScore;
      } else {
        score += 20; // Default score if no price or budget specified
      }

      // Rating score (max 30 points) - use rating or default to 3
      const propertyRating = property.rating || 3;
      score += propertyRating * 6;

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
        const amenityArray = property.amenities || [];
        const totalAmenities = availableAmenities + amenityArray.length;
        score += Math.min(totalAmenities, 15) * 1.5; // Max 22.5 points
      }

      // Vacancy score (max 15 points) - be lenient if missing
      const propertyVacancies = property.vacancies || 0;
      if (propertyVacancies > 0) {
        score += Math.min(propertyVacancies, 5) * 3;
      } else if (property.vacancies === undefined) {
        // If vacancies field doesn't exist, assume available (give partial bonus)
        score += 5;
      }

      // Capacity match score (max 5 points) - be lenient if missing
      const propertyCapacity = property.capacity || property.bedrooms || 1;
      if (propertyCapacity >= min_capacity) {
        score += 5;
      } else if (propertyCapacity > 0) {
        score += 3; // Partial score if capacity is less than required
      }

      return {
        ...property.toObject(),
        score: parseFloat(score.toFixed(2)),
        recommendation_score: parseFloat(score.toFixed(2)),
      };
    });

    // If no candidates found with filters, fallback to all properties for scoring
    if (candidates.length === 0) {
      console.log("⚠️  No properties matched filters. Falling back to all properties...");
      candidates = await Property.find({});
      
      // Still apply scoring to all properties
      candidates = candidates.map((property) => {
        let score = 0;

        // Price score (lower is better, max 25 points)
        if (max_budget && property.price) {
          const priceScore = Math.max(0, (1 - property.price / max_budget) * 25);
          score += priceScore;
        } else {
          score += 20;
        }

        // Rating score (max 30 points)
        const propertyRating = property.rating || 3;
        score += propertyRating * 6;

        // Amenity bonus (max 22.5 points)
        const availableAmenities = Object.values(property.amenities_object || {}).filter(v => v === true).length;
        const amenityArray = property.amenities || [];
        const totalAmenities = availableAmenities + amenityArray.length;
        score += Math.min(totalAmenities, 15) * 1.5;

        // Vacancy score (max 15 points)
        const propertyVacancies = property.vacancies || 0;
        if (propertyVacancies > 0) {
          score += Math.min(propertyVacancies, 5) * 3;
        } else if (property.vacancies === undefined) {
          score += 5;
        }

        // Capacity score (max 5 points)
        const propertyCapacity = property.capacity || property.bedrooms || 1;
        if (propertyCapacity >= min_capacity) {
          score += 5;
        } else if (propertyCapacity > 0) {
          score += 3;
        }

        return {
          ...property.toObject(),
          score: parseFloat(score.toFixed(2)),
          recommendation_score: parseFloat(score.toFixed(2)),
        };
      });
    }

    console.log(`✅ Total candidates after scoring: ${candidates.length}`);

    // Sort by recommendation score
    candidates.sort((a, b) => b.recommendation_score - a.recommendation_score);

    // Return top recommendations
    const recommendations = candidates.slice(0, limit);

    console.log(`📤 Returning ${recommendations.length} recommendations from ${candidates.length} total`);

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

// Track city clicks for analytics
export const trackCityClick = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city || city.trim() === "") {
      return res.status(400).json({ message: "City name is required" });
    }

    // Get user ID from auth token if available
    const userId = req.user ? req.user._id : null;
    const userEmail = req.user ? req.user.email : null;

    // Get IP address
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      null;

    const userAgent = req.headers["user-agent"] || null;

    // Create and save city click record
    const cityClick = new CityClick({
      city: city.trim(),
      userId,
      userEmail,
      ipAddress,
      userAgent,
    });

    await cityClick.save();

    console.log(`✅ Tracked city click: ${city} at ${new Date().toISOString()}`);

    res.json({
      message: "City click tracked successfully",
      cityClick,
    });
  } catch (error) {
    console.error("Error tracking city click:", error);
    res.status(500).json({ message: "Error tracking city click", error: error.message });
  }
};

// Get city click statistics
export const getCityClickStats = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    let filter = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Aggregate city clicks by count
    const stats = await CityClick.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $toLower: "$city" },
          count: { $sum: 1 },
          originalCity: { $first: "$city" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          city: "$originalCity",
          clicks: "$count",
        },
      },
    ]);

    res.json({
      message: "City click statistics retrieved",
      stats,
      total: stats.reduce((sum, item) => sum + item.clicks, 0),
    });
  } catch (error) {
    console.error("Error retrieving city click stats:", error);
    res.status(500).json({ message: "Error retrieving city click statistics", error: error.message });
  }
};

// Export city clicks to CSV
export const exportCityClicksCSV = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Get all city clicks
    const cityClicks = await CityClick.find(filter)
      .sort({ createdAt: -1 })
      .limit(100000); // Safety limit

    // Generate CSV content
    const csvHeaders = ["City", "User Email", "IP Address", "Timestamp"];
    const csvRows = cityClicks.map((click) => [
      click.city,
      click.userEmail || "Anonymous",
      click.ipAddress || "Unknown",
      click.createdAt.toISOString(),
    ]);

    // Combine headers and rows
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((col) => `"${col}"`).join(",")),
    ].join("\n");

    // Send as downloadable file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="city-clicks-${new Date().toISOString().split("T")[0]}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting city clicks to CSV:", error);
    res.status(500).json({ message: "Error exporting city clicks", error: error.message });
  }
};

