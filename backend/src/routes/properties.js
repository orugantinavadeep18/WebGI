import express from "express";
import multer from "multer";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  getSellerProperties,
  searchProperties,
  getPropertyReviews,
  addPropertyReview,
  deletePropertyReview,
} from "../controllers/propertyController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for memory storage (since we're uploading to ImageKit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Specific routes MUST come before wildcard /:id routes

// Public routes - specific named paths
router.get("/search", searchProperties);
router.get("/", getAllProperties);

// Protected routes - specific named paths BEFORE /:id
router.get("/seller/my-properties", authenticateToken, getSellerProperties);

// Review routes - MUST come BEFORE /:id to avoid wildcard catching
router.get("/:id/reviews", getPropertyReviews);
router.post("/:id/reviews", authenticateToken, addPropertyReview);
router.delete("/:id/reviews/:reviewId", authenticateToken, deletePropertyReview);

// Image upload route BEFORE /:id
router.post(
  "/:id/upload-images",
  authenticateToken,
  upload.array("images", 10),
  uploadPropertyImages
);

// ID-based routes (must be last)
router.get("/:id", getPropertyById);
router.post("/", authenticateToken, createProperty);
router.put("/:id", authenticateToken, updateProperty);
router.delete("/:id", authenticateToken, deleteProperty);

export default router;
