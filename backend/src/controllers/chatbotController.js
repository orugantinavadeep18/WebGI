import Property from "../models/Property.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import DirectMessage from "../models/DirectMessage.js";

// FAQ Training Data
const faqData = {
  greetings: [
    { pattern: /^(hi|hello|hey|good morning|good afternoon|good evening)$/i, response: "Hello! Welcome to WebGI - your trusted rental property discovery platform. I'm here to help you find verified hostels, PGs, apartments, and rental properties. How can I assist you today?" },
  ],
  platform: [
    { pattern: /what is webgi/i, response: "WebGI is a comprehensive rental property platform that connects property owners with renters. We specialize in verified hostels, PGs (Paying Guest accommodations), apartments, villas, and houses. Our platform features AI-powered recommendations, direct messaging, secure bookings, and a trust-based verification system." },
    { pattern: /what types of properties/i, response: "WebGI offers multiple property types including Hostels, PGs (Paying Guest accommodations), Apartments, Villas, Houses, and Other rental properties. Each property is verified and comes with transparent information, genuine reviews, and direct owner communication." },
  ],
};

// Database Query Functions
export const getDatabaseStats = async () => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalMessages = await DirectMessage.countDocuments();

    return {
      totalProperties,
      totalUsers,
      totalBookings,
      totalMessages,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return null;
  }
};

export const searchPropertiesByCity = async (city) => {
  try {
    const properties = await Property.find({
      city: { $regex: city, $options: "i" },
    }).select("title price city address images");

    return properties;
  } catch (error) {
    console.error("Error searching properties by city:", error);
    return [];
  }
};

export const searchPropertiesByFilters = async (filters) => {
  try {
    const query = {};

    if (filters.city) {
      query.city = { $regex: filters.city, $options: "i" };
    }

    if (filters.propertyType) {
      query.property_type = { $regex: filters.propertyType, $options: "i" };
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $in: filters.amenities };
    }

    const properties = await Property.find(query)
      .select("title price city property_type amenities images")
      .limit(20);

    return properties;
  } catch (error) {
    console.error("Error searching properties by filters:", error);
    return [];
  }
};

export const getPropertiesByType = async (type) => {
  try {
    const properties = await Property.find({
      property_type: { $regex: type, $options: "i" },
    })
      .select("title price city property_type images")
      .limit(10);

    return properties;
  } catch (error) {
    console.error("Error getting properties by type:", error);
    return [];
  }
};

export const getPopularCities = async () => {
  try {
    const cities = await Property.aggregate([
      {
        $group: {
          _id: { $toLower: "$city" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          city: "$_id",
          count: 1,
        },
      },
    ]);

    return cities;
  } catch (error) {
    console.error("Error getting popular cities:", error);
    return [];
  }
};

export const getPropertyStats = async () => {
  try {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: "$property_type",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    return stats;
  } catch (error) {
    console.error("Error getting property stats:", error);
    return [];
  }
};

export const processChatMessage = async (message) => {
  try {
    const lowerMessage = message.toLowerCase();

    // Extract stats queries
    if (
      lowerMessage.includes("total") &&
      lowerMessage.includes("properties")
    ) {
      const stats = await getDatabaseStats();
      if (stats) {
        return `We currently have ${stats.totalProperties} properties listed on WebGI! We also have ${stats.totalUsers} registered users. Would you like to search for properties in a specific city or with particular filters?`;
      }
    }

    // City-based queries
    if (
      lowerMessage.includes("properties in") ||
      lowerMessage.includes("how many properties")
    ) {
      const cityMatch = message.match(/(?:in|from)\s+(\w+)/i);
      if (cityMatch) {
        const city = cityMatch[1];
        const properties = await searchPropertiesByCity(city);
        if (properties.length > 0) {
          return `I found ${properties.length} properties in ${city}! Here are some highlights:\n${properties
            .slice(0, 3)
            .map((p) => `- ${p.title} (₹${p.price}/month)`)
            .join(
              "\n"
            )}\n\nWould you like more details about any of these properties?`;
        } else {
          return `I didn't find any properties in ${city} at the moment. Try searching other popular cities or use our advanced filters on the Properties page!`;
        }
      }
    }

    // Property type queries
    if (
      lowerMessage.includes("hostel") ||
      lowerMessage.includes("pg") ||
      lowerMessage.includes("apartment")
    ) {
      let type = "";
      if (lowerMessage.includes("hostel")) type = "hostel";
      else if (lowerMessage.includes("pg")) type = "pg";
      else if (lowerMessage.includes("apartment")) type = "apartment";

      const properties = await getPropertiesByType(type);
      if (properties.length > 0) {
        return `Great! I found ${properties.length} ${type}s available. Here are some popular ones:\n${properties
          .slice(0, 3)
          .map((p) => `- ${p.title} in ${p.city} (₹${p.price}/month)`)
          .join(
            "\n"
          )}\n\nVisit the Properties page to filter by price, amenities, and more!`;
      }
    }

    // Price range queries
    if (lowerMessage.includes("under") || lowerMessage.includes("budget")) {
      const priceMatch = message.match(/(\d+)\s*(rupees|rs|₹)?/i);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        const properties = await searchPropertiesByFilters({ maxPrice });
        if (properties.length > 0) {
          return `Found ${properties.length} properties under ₹${maxPrice}! Here are some affordable options:\n${properties
            .slice(0, 3)
            .map((p) => `- ${p.title} (₹${p.price}/month) in ${p.city}`)
            .join(
              "\n"
            )}\n\nUse our price filter on the Properties page to explore more!`;
        }
      }
    }

    // Popular cities query
    if (lowerMessage.includes("popular cities") || lowerMessage.includes("trending cities")) {
      const cities = await getPopularCities();
      if (cities.length > 0) {
        return `Here are the most popular cities on WebGI:\n${cities
          .slice(0, 5)
          .map((c) => `- ${c.city} (${c.count} properties)`)
          .join(
            "\n"
          )}\n\nClick on any city to see available properties in that location!`;
      }
    }

    // Property type statistics
    if (
      lowerMessage.includes("property types") ||
      lowerMessage.includes("how many")
    ) {
      const stats = await getPropertyStats();
      if (stats.length > 0) {
        return `Here's the breakdown of property types on WebGI:\n${stats
          .map((s) => `- ${s._id}: ${s.count} listings (avg ₹${Math.round(s.avgPrice)}/month)`)
          .join(
            "\n"
          )}\n\nWhich type interests you?`;
      }
    }

    // Default helpful response
    return `I'm here to help! I can assist you with:\n- Finding properties in specific cities\n- Searching by price range or property type\n- Checking how many properties are available\n- Answering questions about how WebGI works\n\nWhat would you like to know?`;
  } catch (error) {
    console.error("Error processing chat message:", error);
    return "I encountered an error while processing your request. Please try rephrasing your question or visit the Properties page for advanced filtering options.";
  }
};

// Main chatbot endpoint
export const chatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await processChatMessage(message);

    res.json({
      message: response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to process chatbot query" });
  }
};

// Get database statistics for display
export const getStats = async (req, res) => {
  try {
    const stats = await getDatabaseStats();

    if (!stats) {
      return res.status(500).json({ error: "Failed to retrieve statistics" });
    }

    res.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to retrieve statistics" });
  }
};

// Get popular cities
export const getCities = async (req, res) => {
  try {
    const cities = await getPopularCities();
    res.json({ cities });
  } catch (error) {
    console.error("Cities error:", error);
    res.status(500).json({ error: "Failed to retrieve cities" });
  }
};

// Search properties with filters
export const searchProperties = async (req, res) => {
  try {
    const { city, propertyType, minPrice, maxPrice, amenities } = req.query;

    const properties = await searchPropertiesByFilters({
      city,
      propertyType,
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      amenities: amenities ? (typeof amenities === "string" ? [amenities] : amenities) : [],
    });

    res.json({ properties });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search properties" });
  }
};
