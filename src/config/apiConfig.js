// API Configuration for WebGI

// Backend Express API
export const BACKEND_API_URL = import.meta.env.VITE_API_BASE_URL || "https://webgi-2-vpru.onrender.com/api";

// ML Recommendation Server (Render Deployment or Local)
export const ML_SERVER_URL = import.meta.env.VITE_ML_SERVER_URL || "https://webgi-1-w9du.onrender.com";

// ML Recommendation Endpoint
export const ML_RECOMMEND_ENDPOINT = (city, maxBudget, topK = 100) => 
  `${ML_SERVER_URL}/recommend?city=${encodeURIComponent(city)}&max_budget=${maxBudget}&top_k=${topK}`;

// Other ML Endpoints
export const ML_HEALTH_CHECK = `${ML_SERVER_URL}/health`;
export const ML_GET_RECOMMENDATIONS_JSON = `${ML_SERVER_URL}/get-recommendations-json`;
export const ML_SAVED_RECOMMENDATIONS = `${ML_SERVER_URL}/saved-recommendations`;

// Environment Info
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API Config Info
export const API_CONFIG = {
  backend: BACKEND_API_URL,
  mlServer: ML_SERVER_URL,
  environment: isDevelopment ? "development" : "production",
  timestamp: new Date().toISOString()
};

// Log configuration on app start (development only)
if (isDevelopment) {
  console.log("🔧 API Configuration:", API_CONFIG);
}
