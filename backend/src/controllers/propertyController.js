import mongoose from "mongoose";
import Property from "../models/Property.js";
import imagekit from "../config/imagekit.js";

export const getAllProperties = async (req, res) => {
  try {
    const { city, propertyType, minPrice, maxPrice, bedrooms, status } =
      req.query;
    const filter = {};

    if (city) filter.city = city;
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (status) filter.status = status;

    const properties = await Property.find(filter)
      .limit(50)
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    console.log("📝 CREATE PROPERTY - User:", req.user);
    console.log("📝 CREATE PROPERTY - Request Body:", req.body);

    const {
      title,
      name,
      description,
      about,
      price,
      property_type,
      propertyType,
      capacity,
      vacancies,
      address,
      location,
      city,
      state,
      zipCode,
      amenities,
      amenities_object,
      rules,
      required_documents,
      owner_details,
      gender_preference,
      sharing_type,
      status,
      bedrooms,
      bathrooms,
      squareFeet,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !city
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Title, description, price, and city are required" });
    }

    const property = new Property({
      title,
      name: name || title,
      description,
      about,
      price: Number(price),
      property_type: property_type || propertyType,
      propertyType: propertyType || property_type,
      capacity: capacity ? Number(capacity) : 1,
      vacancies: vacancies ? Number(vacancies) : 0,
      address,
      location: location || address,
      city,
      state,
      zipCode,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      squareFeet: squareFeet ? Number(squareFeet) : undefined,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(",") : []),
      amenities_object: amenities_object || {},
      rules,
      required_documents,
      owner_details,
      gender_preference: gender_preference || "unisex",
      sharing_type: sharing_type || "shared",
      status: status || "available",
      seller: req.user.id,
    });

    console.log("📝 CREATE PROPERTY - Property object:", property);
    const savedProperty = await property.save();
    console.log("✅ CREATE PROPERTY - Saved successfully:", savedProperty._id);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error("❌ CREATE PROPERTY ERROR:", error);
    console.error("Error Stack:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Check if user is the seller
    if (property.seller !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own properties",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Check if user is the seller or admin
    const User = require("../models/User").default || require("../models/User");
    const currentUser = await User.findById(req.user.id);
    const isAdmin = currentUser && currentUser.email === "kittu8441@gmail.com";
    const isSeller = property.seller === req.user.id;

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only property owner or admin can delete",
      });
    }

    // Delete images from ImageKit
    for (const image of property.images) {
      try {
        // Extract file ID from URL or use the stored fileId
        if (image.fileId) {
          await imagekit.deleteFile(image.fileId);
        }
      } catch (err) {
        console.log("Error deleting image from ImageKit:", err);
      }
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadPropertyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Check if user is the seller
    if (property.seller !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only upload images to your own properties",
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      try {
        // Upload to ImageKit
        const response = await imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: `/properties/${req.params.id}/`,
        });

        uploadedImages.push({
          url: response.url,
          fileId: response.fileId,
          name: file.originalname,
          uploadedAt: new Date(),
        });

        console.log(`Image uploaded successfully: ${response.url}`);
      } catch (err) {
        console.error("Error uploading file to ImageKit:", err);
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload images to ImageKit",
      });
    }

    property.images.push(...uploadedImages);
    const updatedProperty = await property.save();

    res.json({
      success: true,
      message: "Images uploaded successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSellerProperties = async (req, res) => {
  try {
    console.log(`🔍 getSellerProperties - req.user:`, req.user);
    console.log(`🔍 Searching for properties with seller ID: ${req.user.id} (type: ${typeof req.user.id})`);
    
    // Convert string ID to ObjectId if needed
    const sellerId = mongoose.Types.ObjectId.isValid(req.user.id) 
      ? new mongoose.Types.ObjectId(req.user.id)
      : req.user.id;
    
    console.log(`🔍 Query will use: ${sellerId} (type: ${typeof sellerId})`);
    
    const properties = await Property.find({ seller: sellerId })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${properties.length} properties for seller`);
    
    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    console.error(`❌ Error in getSellerProperties:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchProperties = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Search query required" });
    }

    const properties = await Property.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20);

    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get reviews for a property
export const getPropertyReviews = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 getPropertyReviews - Looking for property with ID: ${id}`);
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`❌ Invalid ObjectId format: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid property ID format" });
    }
    
    const property = await Property.findById(id);

    if (!property) {
      console.log(`❌ Property not found with ID: ${id}`);
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    console.log(`✅ Found property: ${property.title || property.name}`);
    const reviews = property.ratings || [];
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(`❌ Error in getPropertyReviews:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add review to property
export const addPropertyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || req.user?.email || "Anonymous";

    console.log(`📝 addPropertyReview - Property ID: ${id}, User: ${userId}, Name: ${userName}`);

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`❌ Invalid ObjectId format: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid property ID format" });
    }

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const property = await Property.findById(id);
    if (!property) {
      console.log(`❌ Property not found with ID: ${id}`);
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    console.log(`✅ Found property: ${property.title || property.name}`);

    const review = {
      userId,
      rating: parseInt(rating),
      comment,
      userName: userName,
      createdAt: new Date(),
    };

    property.ratings.push(review);
    await property.save();

    console.log(`✅ Review added successfully`);
    res.json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    console.error(`❌ Error in addPropertyReview:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review from property
export const deletePropertyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.user?.id;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`❌ Invalid ObjectId format: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid property ID format" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const reviewIndex = property.ratings.findIndex(
      (r) => r._id.toString() === reviewId && r.userId === userId
    );

    if (reviewIndex === -1) {
      return res.status(403).json({ success: false, message: "Not authorized or review not found" });
    }

    property.ratings.splice(reviewIndex, 1);
    await property.save();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};