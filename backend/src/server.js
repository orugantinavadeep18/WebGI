import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/User.js";
import Property from "./models/Property.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import bookingRoutes from "./routes/bookings.js";
import messageRoutes from "./routes/messages.js";
import rentalRoutes from "./routes/rentals.js";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors()); // Allow requests from any server
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB and print users with property counts
connectDB().then(async () => {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("📋 REGISTERED USERS (For Development)");
    console.log("=".repeat(60));
    const users = await User.find({}, "email name _id").sort({ createdAt: -1 });
    if (users.length === 0) {
      console.log("⚠️  No users registered yet");
    } else {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const propertyCount = await Property.countDocuments({ seller: user._id });
        console.log(`${i + 1}. Email: ${user.email} | Name: ${user.name} | My Properties: ${propertyCount}`);
      }
    }
    console.log("=".repeat(60));
    console.log("💡 Tip: Use email and password '123456' for admin account");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rentals", rentalRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("Route:", req.method, req.path);
  console.error("User:", req.user);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} in ${NODE_ENV} mode`);
});
