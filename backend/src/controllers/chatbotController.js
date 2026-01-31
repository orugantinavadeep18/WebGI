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
    console.log("📝 Processing message:", message);

    // 1. TOTAL PROPERTIES QUERY
    if (lowerMessage.includes("how many") && lowerMessage.includes("properties")) {
      console.log("🔍 Detected: Total properties query");
      const stats = await getDatabaseStats();
      if (stats) {
        console.log("✅ Stats found:", stats);
        return `🏠 **We currently have ${stats.totalProperties} properties available on WebGI!**\n\nWith ${stats.totalUsers} registered users and ${stats.totalBookings} bookings made so far.\n\nWould you like to search by city or price range?`;
      }
    }

    // 2. PROPERTIES IN CITY
    if (lowerMessage.includes("properties in") || lowerMessage.includes("in ")) {
      const cityMatch = message.match(/(?:in|from)\s+([A-Za-z]+)/i);
      if (cityMatch) {
        const city = cityMatch[1];
        console.log("🔍 Detected: City query for", city);
        const properties = await searchPropertiesByCity(city);
        if (properties.length > 0) {
          console.log("✅ Found", properties.length, "properties in", city);
          return `📍 **Found ${properties.length} properties in ${city}!**\n\n${properties
            .slice(0, 3)
            .map((p) => `• **${p.title}** - ₹${p.price}/month`)
            .join("\n")}\n\nVisit the Properties page to see all listings!`;
        } else {
          return `❌ No properties found in ${city} yet. Try other cities or check back soon!`;
        }
      }
    }

    // 3. HOSTEL QUERY
    if (lowerMessage.includes("hostel")) {
      console.log("🔍 Detected: Hostel query");
      const properties = await getPropertiesByType("hostel");
      if (properties.length > 0) {
        console.log("✅ Found", properties.length, "hostels");
        return `🛏️ **Found ${properties.length} Hostels available!**\n\n${properties
          .slice(0, 3)
          .map((p) => `• **${p.title}** in ${p.city} - ₹${p.price}/month`)
          .join("\n")}\n\nGreat for students and travelers!`;
      }
    }

    // 4. PG QUERY
    if (lowerMessage.includes("pg") || lowerMessage.includes("paying guest")) {
      console.log("🔍 Detected: PG query");
      const properties = await getPropertiesByType("pg");
      if (properties.length > 0) {
        console.log("✅ Found", properties.length, "PGs");
        return `🏢 **Found ${properties.length} PGs (Paying Guest) available!**\n\n${properties
          .slice(0, 3)
          .map((p) => `• **${p.title}** in ${p.city} - ₹${p.price}/month`)
          .join("\n")}\n\nPerfect for working professionals!`;
      }
    }

    // 5. APARTMENT QUERY
    if (lowerMessage.includes("apartment")) {
      console.log("🔍 Detected: Apartment query");
      const properties = await getPropertiesByType("apartment");
      if (properties.length > 0) {
        console.log("✅ Found", properties.length, "apartments");
        return `🏠 **Found ${properties.length} Apartments available!**\n\n${properties
          .slice(0, 3)
          .map((p) => `• **${p.title}** in ${p.city} - ₹${p.price}/month`)
          .join("\n")}\n\nComfortable and modern living spaces!`;
      }
    }

    // 6. POPULAR CITIES
    if (lowerMessage.includes("popular cities") || lowerMessage.includes("trending") || lowerMessage.includes("top cities")) {
      console.log("🔍 Detected: Popular cities query");
      const cities = await getPopularCities();
      if (cities.length > 0) {
        console.log("✅ Found popular cities:", cities);
        return `🌍 **Most Popular Cities on WebGI:**\n\n${cities
          .slice(0, 5)
          .map((c, i) => `${i + 1}. **${c.city}** - ${c.count} properties`)
          .join("\n")}\n\nExplore properties in these trending locations!`;
      }
    }

    // 7. BUDGET/PRICE QUERY
    if (lowerMessage.includes("under") || lowerMessage.includes("budget") || lowerMessage.includes("affordable")) {
      const priceMatch = message.match(/(\d+)\s*(rupees|rs|₹)?/i);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        console.log("🔍 Detected: Price query for max", maxPrice);
        const properties = await searchPropertiesByFilters({ maxPrice });
        if (properties.length > 0) {
          console.log("✅ Found", properties.length, "properties under ₹" + maxPrice);
          return `💰 **Found ${properties.length} properties under ₹${maxPrice}!**\n\n${properties
            .slice(0, 3)
            .map((p) => `• **${p.title}** in ${p.city} - ₹${p.price}/month`)
            .join("\n")}\n\nCheck the Properties page for all budget options!`;
        }
      }
    }

    // DEFAULT RESPONSE
    console.log("📝 Using default response");
    return `👋 **Hello! I'm your WebGI Assistant.**\n\nI can help you with:\n• **How many properties?** - Get total count\n• **Properties in [city]** - Search by location\n• **Show me hostels/PGs/apartments** - Browse by type\n• **Popular cities** - See trending locations\n• **Properties under ₹[amount]** - Budget search\n\nWhat would you like to know?`;
  } catch (error) {
    console.error("❌ Error processing chat:", error.message);
    return `Sorry, I encountered an error. Please try again or visit the Properties page directly!`;
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
