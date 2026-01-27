import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    pricePerSqft: {
      type: Number,
    },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "villa", "land", "commercial"],
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    squareFeet: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    images: [
      {
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    amenities: [String],
    seller: {
      type: String,
      required: true,
      // Stores Supabase user ID (UUID) instead of MongoDB ObjectId
    },
    status: {
      type: String,
      enum: ["available", "sold", "pending"],
      default: "available",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

// Create index for location-based search
propertySchema.index({ city: 1, propertyType: 1, price: 1 });

export default mongoose.model("Property", propertySchema);
