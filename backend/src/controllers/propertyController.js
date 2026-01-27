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
      description,
      price,
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      address,
      city,
      state,
      zipCode,
      amenities,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !propertyType ||
      !bedrooms ||
      !bathrooms ||
      !squareFeet ||
      !address ||
      !city ||
      !state ||
      !zipCode
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be filled" });
    }

    const property = new Property({
      title,
      description,
      price: Number(price),
      propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      squareFeet: Number(squareFeet),
      address,
      city,
      state,
      zipCode,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(",") : []),
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

    // Check if user is the seller
    if (property.seller !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own properties",
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
    const properties = await Property.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
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
