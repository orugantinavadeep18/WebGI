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

// Public routes
router.get("/", getAllProperties);
router.get("/search", searchProperties);
router.get("/:id", getPropertyById);

// Protected routes (authenticated users only)
router.post("/", authenticateToken, createProperty);
router.put("/:id", authenticateToken, updateProperty);
router.delete("/:id", authenticateToken, deleteProperty);
router.post(
  "/:id/upload-images",
  authenticateToken,
  upload.array("images", 10),
  uploadPropertyImages
);
router.get("/seller/my-properties", authenticateToken, getSellerProperties);

export default router;
