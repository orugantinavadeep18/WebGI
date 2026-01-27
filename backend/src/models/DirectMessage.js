import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      // Stores Supabase user ID (UUID)
    },
    receiver: {
      type: String,
      required: true,
      // Stores Supabase user ID (UUID)
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create compound index for efficient querying
directMessageSchema.index({ sender: 1, receiver: 1 });
directMessageSchema.index({ receiver: 1, isRead: 1 });

export default mongoose.model("DirectMessage", directMessageSchema);
