import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
