import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import bookingRoutes from "./routes/bookings.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:8081",
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
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
