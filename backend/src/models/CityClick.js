import mongoose from "mongoose";

const cityClickSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "City name is required"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Anonymous clicks will have null userId
    },
    userEmail: {
      type: String,
      default: null, // Store email for reference even if user is not registered
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    userAgent: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by city and date range
cityClickSchema.index({ city: 1, createdAt: -1 });
cityClickSchema.index({ createdAt: -1 });

const CityClick = mongoose.model("CityClick", cityClickSchema);

export default CityClick;
