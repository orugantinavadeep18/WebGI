import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    about: String,
    amenities: {
      wifi: { type: Boolean, default: false },
      food: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      power_backup: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      cctv: { type: Boolean, default: false },
    },
    rules: String,
    required_documents: String,
    owner_details: String,
    vacancies: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    property_type: {
      type: String,
      enum: ["hostel", "pg", "others"],
      default: "pg",
    },
    capacity: {
      type: Number,
      default: 1,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
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
    is_selected: {
      type: Boolean,
      default: false,
    },
    images: [{
      type: String,
      default: null,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rental", recommendationSchema);
