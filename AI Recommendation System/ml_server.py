from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import json
from datetime import datetime
from functools import lru_cache
from dotenv import load_dotenv
from pymongo import MongoClient
import logging
import numpy as np

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create recommendations directory
RECOMMENDATIONS_DIR = "recommendations"
os.makedirs(RECOMMENDATIONS_DIR, exist_ok=True)

# Cache settings
CACHE_SIZE = 128
CACHE_TTL = 3600  # 1 hour

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & features with fallback
try:
    if os.path.exists("best_model.pkl"):
        import joblib
        model = joblib.load("best_model.pkl")
        feature_names = joblib.load("feature_names.pkl")
    else:
        logger.warning("Model files not found - using mock model")
        model = None
        feature_names = ["Rating", "Capacity", "wifi", "ac", "parking"]
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None
    feature_names = ["Rating", "Capacity", "wifi", "ac", "parking"]

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://localhost/WebGI")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000, connectTimeoutMS=2000)
    # Try to ping the server with timeout
    try:
        client.admin.command("ping", maxTimeMS=2000)
        db = client["webgi"]
        collection = db["properties"]
        logger.info("MongoDB connection successful")
    except Exception as ping_error:
        logger.warning(f"MongoDB ping failed: {ping_error} - using demo mode")
        collection = None
except Exception as e:
    logger.error(f"MongoDB connection failed: {e}")
    collection = None

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "mongo_connected": collection is not None
    }

def get_demo_data(city: str):
    """Return demo property data for testing without MongoDB"""
    demo_properties = {
        "Bangalore": [
            {
                "_id": "demo-b001",
                "name": "Sky High Hostel",
                "city": "Bangalore",
                "price": 8500,
                "rating": 4.5,
                "capacity": 20,
                "views": 1250,
                "vacancies": 5,
                "amenities": "wifi, ac, parking, food"
            },
            {
                "_id": "demo-b002",
                "name": "Budget Stay Bangalore",
                "city": "Bangalore",
                "price": 6500,
                "rating": 4.2,
                "capacity": 15,
                "views": 890,
                "vacancies": 3,
                "amenities": "wifi, ac, laundry"
            },
            {
                "_id": "demo-b003",
                "name": "City Center Rooms",
                "city": "Bangalore",
                "price": 9200,
                "rating": 4.7,
                "capacity": 25,
                "views": 2100,
                "vacancies": 7,
                "amenities": "wifi, ac, parking, food, security, cctv"
            },
            {
                "_id": "demo-b004",
                "name": "Eco Hostel",
                "city": "Bangalore",
                "price": 5500,
                "rating": 4.0,
                "capacity": 10,
                "views": 450,
                "vacancies": 2,
                "amenities": "wifi, food"
            }
        ],
        "Mumbai": [
            {
                "_id": "demo-m001",
                "name": "Marine Bay Hostel",
                "city": "Mumbai",
                "price": 9500,
                "rating": 4.6,
                "capacity": 30,
                "views": 1800,
                "vacancies": 8,
                "amenities": "wifi, ac, parking, food, security"
            },
            {
                "_id": "demo-m002",
                "name": "Beach Side Rooms",
                "city": "Mumbai",
                "price": 7500,
                "rating": 4.3,
                "capacity": 18,
                "views": 1200,
                "vacancies": 4,
                "amenities": "wifi, ac, food"
            }
        ],
        "Delhi": [
            {
                "_id": "demo-d001",
                "name": "Delhi Central Stay",
                "city": "Delhi",
                "price": 7200,
                "rating": 4.4,
                "capacity": 22,
                "views": 1050,
                "vacancies": 6,
                "amenities": "wifi, ac, parking, food"
            },
            {
                "_id": "demo-d002",
                "name": "Heritage Rooms",
                "city": "Delhi",
                "price": 8800,
                "rating": 4.8,
                "capacity": 28,
                "views": 2300,
                "vacancies": 9,
                "amenities": "wifi, ac, parking, food, security, cctv, power_backup"
            }
        ]
    }
    
    return demo_properties.get(city, demo_properties.get("Bangalore", []))

@app.get("/recommend")
def recommend(
    city: str = "Bangalore",
    max_budget: int = 10000,
    top_k: int = 5
):
    """Get recommendations for properties based on budget from entire database"""
    try:
        # Fetch from entire database, not just the specified city
        # This gives better recommendations by considering all properties
        if collection is not None:
            raw_data = list(collection.find(
                {},  # No city filter - query all properties
                {"_id": 1, "price": 1, "rating": 1, "capacity": 1, "amenities": 1, "name": 1, "city": 1}
            ).limit(500))  # Increased limit to query more properties from entire DB
            
            # Convert ObjectId to string immediately
            for item in raw_data:
                if "_id" in item:
                    item["_id"] = str(item["_id"])
            
            data = raw_data
        else:
            data = []
        
        # Fallback to demo data if no data found
        if len(data) == 0:
            logger.info(f"No data found in MongoDB, using demo data")
            data = get_demo_data(city)

        if len(data) == 0:
            return {"recommendations": [], "message": f"No properties found", "mode": "demo"}

        df = pd.DataFrame(data)

        # Fast filtering using numpy - filter by budget only
        if "price" in df.columns:
            mask = df["price"].fillna(0) <= max_budget
            df = df[mask]
        
        if df.empty:
            return {"recommendations": [], "message": "No properties match your budget", "mode": "demo"}

        # Fast scoring without model (vectorized)
        df["score"] = (
            df.get("rating", pd.Series([0]*len(df))).fillna(0) * 0.7 +
            (df.get("capacity", pd.Series([1]*len(df))).fillna(1) / 10) * 0.3
        )

        # Sort and get top K
        result = df.nlargest(top_k, "score")
        
        # Ensure _id exists for all results
        if "_id" not in result.columns:
            # For demo data, create fake but consistent IDs
            result = result.copy()
            result["_id"] = ["demo-" + str(i) for i in range(len(result))]
        
        # Select only available columns to avoid KeyError
        available_cols = ["_id", "name", "price", "rating", "capacity", "amenities", "score"]
        cols_to_select = [col for col in available_cols if col in result.columns]
        recommendations = result[cols_to_select].to_dict(orient="records")
        
        # Auto-save recommendations
        saved_file = save_recommendations(city, max_budget, recommendations)

        return {
            "recommendations": recommendations,
            "total_found": len(df),
            "mode": "mongodb" if collection is not None else "demo",
            "saved": saved_file is not None,
            "saved_file": saved_file.split('\\')[-1] if saved_file else None
        }
    
    except Exception as e:
        logger.error(f"Error in recommend: {e}")
        return {"error": str(e)}

@app.get("/get-recommendations-json")
def get_recommendations_json():
    """Get the last saved recommendations from JSON file"""
    try:
        filepath = os.path.join(RECOMMENDATIONS_DIR, "recommendations.json")
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                data = json.load(f)
            return data
        else:
            return {"recommendations": [], "message": "No recommendations saved yet"}
    except Exception as e:
        logger.error(f"Error reading recommendations JSON: {e}")
        return {"error": str(e), "recommendations": []}

@app.get("/save-recommendations-endpoint")
def save_recommendations_endpoint(city: str, max_budget: int):
    """Manually save recommendations to JSON file"""
    try:
        # Get recommendations from database
        if collection is not None:
            data_list = list(collection.find({"City": city}, {"_id": 0}).limit(100))
        else:
            data_list = get_demo_data(city)
        
        if not data_list:
            return {"error": "No data found"}
        
        df = pd.DataFrame(data_list)
        df = df[df["Price"] <= max_budget] if "Price" in df.columns else df
        
        if df.empty:
            return {"error": "No properties match budget"}
        
        df = preprocess(df)
        try:
            X = df[feature_names]
            df["score"] = model.predict(X)
        except:
            df["score"] = df.get("Rating", 0) * 0.6 + (df.get("Capacity", 1) / 10) * 0.4
        
        df = df.sort_values("score", ascending=False)
        recommendations = df.head(5).to_dict(orient="records")
        
        filename = f"{city}_{max_budget}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(RECOMMENDATIONS_DIR, filename)
        
        data = {
            "city": city,
            "max_budget": max_budget,
            "timestamp": datetime.now().isoformat(),
            "recommendations": recommendations
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Saved recommendations to {filepath}")
        return {"success": True, "file": filename, "path": filepath}
    except Exception as e:
        logger.error(f"Error saving recommendations: {e}")
        return {"error": str(e)}

@app.get("/saved-recommendations")
def get_saved_recommendations():
    """Get list of all saved recommendation files"""
    try:
        files = []
        if os.path.exists(RECOMMENDATIONS_DIR):
            for file in os.listdir(RECOMMENDATIONS_DIR):
                if file.endswith('.json'):
                    filepath = os.path.join(RECOMMENDATIONS_DIR, file)
                    files.append({
                        "filename": file,
                        "path": filepath,
                        "size": os.path.getsize(filepath),
                        "modified": datetime.fromtimestamp(os.path.getmtime(filepath)).isoformat()
                    })
        
        return {"files": sorted(files, key=lambda x: x['modified'], reverse=True)}
    except Exception as e:
        logger.error(f"Error retrieving saved recommendations: {e}")
        return {"error": str(e)}

@app.get("/load-recommendation/{filename}")
def load_recommendation(filename: str):
    """Load a specific saved recommendation file"""
    try:
        filepath = os.path.join(RECOMMENDATIONS_DIR, filename)
        
        # Security check - prevent directory traversal
        if not os.path.abspath(filepath).startswith(os.path.abspath(RECOMMENDATIONS_DIR)):
            return {"error": "Invalid file path"}
        
        if not os.path.exists(filepath):
            return {"error": "File not found"}
        
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        return data
    except Exception as e:
        logger.error(f"Error loading recommendation: {e}")
        return {"error": str(e)}

def save_recommendations(city: str, max_budget: int, recommendations: list):
    """Utility function to save recommendations to a single JSON file (overwrites previous)"""
    try:
        # Always save to the same file: recommendations.json
        filepath = os.path.join(RECOMMENDATIONS_DIR, "recommendations.json")
        
        data = {
            "city": city,
            "max_budget": max_budget,
            "timestamp": datetime.now().isoformat(),
            "recommendations": recommendations
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Saved recommendations to {filepath}")
        return filepath
    except Exception as e:
        logger.error(f"Error saving recommendations: {e}")
        return None

def preprocess(df):
    """Preprocess dataframe for model prediction"""
    # Drop non-numeric columns
    df = df.drop(['City', 'Name'], axis=1, errors='ignore')
    
    # Fill missing values
    numeric_cols = ["Rating", "Views", "Vacancies", "Capacity", "Price"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    
    if "Capacity" in df.columns:
        df.loc[df["Capacity"] == 0, "Capacity"] = 1

    # Amenity encoding
    amenities = [
        "wifi", "food", "ac", "parking",
        "laundry", "power_backup", "security", "cctv"
    ]

    if "Amenities" in df.columns:
        for amenity in amenities:
            df[amenity] = df["Amenities"].astype(str).str.lower().str.contains(amenity, na=False).astype(int)
    else:
        for amenity in amenities:
            df[amenity] = 0

    # Ensure all feature columns exist
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    return df

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)