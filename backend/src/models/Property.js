import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // Basic info (works for both properties and rentals)
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    name: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    about: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    pricePerSqft: {
      type: Number,
    },

    // Property type
    propertyType: {
      type: String,
      enum: ["apartment", "house", "villa", "land", "commercial", "hostel", "pg", "others"],
      required: true,
    },
    property_type: {
      type: String,
      enum: ["hostel", "pg", "others", "apartment", "house", "villa", "land", "commercial"],
    },

    // Real estate specific
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    squareFeet: {
      type: Number,
    },

    // Rental specific (capacity, vacancies)
    capacity: {
      type: Number,
      default: 1,
    },
    vacancies: {
      type: Number,
      default: 0,
    },

    // Location
    address: {
      type: String,
    },
    location: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },

    // Images
    images: [
      {
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        fileId: String,
      },
    ],

    // Amenities (both formats)
    amenities: [String],
    amenities_object: {
      wifi: { type: Boolean, default: false },
      food: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      power_backup: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      cctv: { type: Boolean, default: false },
    },

    // Owner/seller
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owner_details: {
      type: String,
    },

    // Status
    status: {
      type: String,
      enum: ["available", "sold", "pending"],
      default: "available",
    },
    is_selected: {
      type: Boolean,
      default: false,
    },

    // Ratings/reviews
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratings: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        userName: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Rental specific fields
    rules: String,
    required_documents: String,
    gender_preference: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    sharing_type: {
      type: String,
      enum: ["single", "double", "triple", "shared"],
      default: "shared",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
propertySchema.index({ city: 1, propertyType: 1, price: 1 });
propertySchema.index({ location: 1, property_type: 1, price: 1 });
propertySchema.index({ seller: 1 });

export default mongoose.model("Property", propertySchema);
