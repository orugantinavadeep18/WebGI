import express from "express";
import {
  chatbotQuery,
  getStats,
  getCities,
  searchProperties,
} from "../controllers/chatbotController.js";

const router = express.Router();

// Chatbot query endpoint
router.post("/query", chatbotQuery);

// Get database statistics
router.get("/stats", getStats);

// Get popular cities
router.get("/cities", getCities);

// Search properties with filters
router.get("/search", searchProperties);

export default router;
