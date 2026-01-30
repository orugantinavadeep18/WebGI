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
model = None
feature_names = ["Rating", "Capacity", "wifi", "ac", "parking"]

try:
    if os.path.exists("best_model.pkl"):
        try:
            import joblib
            model = joblib.load("best_model.pkl")
            feature_names = joblib.load("feature_names.pkl")
            logger.info("✅ Model loaded successfully")
        except Exception as model_error:
            logger.warning(f"⚠️ Error loading model files: {model_error}")
            logger.warning("Using fallback scoring formula")
            model = None
    else:
        logger.warning("⚠️ Model files not found - using fallback scoring formula")
        model = None
except Exception as e:
    logger.error(f"❌ Unexpected error in model loading: {e}")
    model = None

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    logger.warning("⚠️ MONGO_URI not found in environment, will use demo data")
    collection = None
else:
    logger.info(f"🔌 Attempting MongoDB connection with URI: {MONGO_URI[:50]}...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
        # Try to ping the server with timeout
        try:
            client.admin.command("ping", maxTimeMS=5000)
            db = client["webgi"]
            collection = db["properties"]
            logger.info("✅ MongoDB connection successful")
        except Exception as ping_error:
            logger.warning(f"⚠️ MongoDB ping failed: {ping_error} - using demo mode")
            collection = None
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        collection = None

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "mongo_connected": collection is not None
    }

@app.get("/test-demo-data")
def test_demo_data():
    """Test endpoint to check demo data generation"""
    try:
        bangalore = get_demo_data("Bangalore")
        hyderabad = get_demo_data("Hyderabad")
        mumbai = get_demo_data("Mumbai")
        
        all_demo = bangalore + hyderabad + mumbai
        
        return {
            "bangalore_count": len(bangalore),
            "hyderabad_count": len(hyderabad),
            "mumbai_count": len(mumbai),
            "total_demo": len(all_demo),
            "sample": all_demo[:2] if all_demo else []
        }
    except Exception as e:
        logger.error(f"Error in test demo data: {e}")
        return {"error": str(e)}

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
    city: str = "all",
    max_budget: int = 500000,
    top_k: int = 100
):
    """Score ALL properties in MongoDB using best_model.pkl, save to recommendations.json"""
    try:
        # Handle "all cities" case
        if city.lower() in ["all", "all cities", "*", ""]:
            city_display = "All Cities"
            logger.info(f"🎯 Scoring ALL properties from ALL CITIES (budget: ₹{max_budget}, top_k: {top_k}) using best_model.pkl")
            city_filter = {}  # No filter = get all cities
        else:
            city_display = city
            logger.info(f"🎯 Scoring ALL properties in {city} (budget: ₹{max_budget}, top_k: {top_k}) using best_model.pkl")
            city_filter = {"city": {"$regex": city, "$options": "i"}}
        
        # Fetch ALL properties from MongoDB
        if collection is not None:
            try:
                logger.info(f"🔍 Querying MongoDB with filter: {city_filter}")
                raw_data = list(collection.find(city_filter).limit(5000))
                
                logger.info(f"📊 Found {len(raw_data)} properties in MongoDB for: {city_display}")
                
                # Convert ObjectId to string immediately
                for item in raw_data:
                    if "_id" in item:
                        item["_id"] = str(item["_id"])
                
                data = raw_data
            except Exception as db_error:
                logger.error(f"❌ Database error: {db_error}")
                data = []
        else:
            logger.warning("⚠️ MongoDB not connected, trying Express backend API...")
            data = []
            
            # Try to fetch from Express backend as fallback
            try:
                import requests
                backend_url = "http://localhost:5000/api/rentals"
                logger.info(f"📡 Attempting to fetch from backend: {backend_url}")
                response = requests.get(backend_url, timeout=5)
                
                if response.status_code == 200:
                    backend_data = response.json()
                    rentals = backend_data.get("rentals", [])
                    
                    # Filter by city if needed
                    if city_filter:
                        import re
                        city_pattern = city_filter["city"]["$regex"]
                        rentals = [r for r in rentals if re.search(city_pattern, r.get("city", "") or r.get("location", ""), re.IGNORECASE)]
                    
                    # Convert to the expected format
                    data = []
                    for r in rentals:
                        data.append({
                            "_id": str(r.get("_id", "")),
                            "name": r.get("name", ""),
                            "price": r.get("price", 0),
                            "rating": r.get("rating", 0),
                            "capacity": r.get("capacity", 1),
                            "amenities": r.get("amenities", {}),
                            "city": r.get("location", ""),
                            "location": r.get("location", ""),
                            "property_type": r.get("property_type", ""),
                            "images": r.get("images", [])
                        })
                    
                    logger.info(f"✅ Fetched {len(data)} properties from Express backend")
                else:
                    logger.warning(f"⚠️ Backend returned status {response.status_code}")
            except Exception as backend_error:
                logger.warning(f"⚠️ Could not fetch from backend: {backend_error}")
        
        # Fallback to demo data if no data found
        if len(data) == 0:
            logger.info(f"📌 No data in MongoDB, generating demo data for: {city_display}")
            if city.lower() in ["all", "all cities", "*", ""]:
                # Demo data for all cities
                logger.info("📝 Creating demo data for all cities")
                demo_bangalore = get_demo_data("Bangalore")
                demo_hyderabad = get_demo_data("Hyderabad")
                demo_mumbai = get_demo_data("Mumbai")
                
                logger.info(f"   - Bangalore: {len(demo_bangalore)} properties")
                logger.info(f"   - Hyderabad: {len(demo_hyderabad)} properties")
                logger.info(f"   - Mumbai: {len(demo_mumbai)} properties")
                
                data = demo_bangalore + demo_hyderabad + demo_mumbai
                logger.info(f"✅ Total demo data: {len(data)} properties")
            else:
                data = get_demo_data(city)
                logger.info(f"✅ Generated {len(data)} demo properties for: {city}")

        if len(data) == 0:
            logger.warning(f"❌ No properties available for: {city_display}")
            return {
                "recommendations": [],
                "all_scored_properties": [],
                "total_properties_scored": 0,
                "message": f"No properties found for: {city_display}",
                "mode": "error"
            }

        df = pd.DataFrame(data)
        logger.info(f"📊 Processing {len(df)} properties for: {city_display}")

        # Use the pre-trained model if available
        if model is not None:
            try:
                logger.info("🤖 Using best_model.pkl for scoring")
                # Preprocess data for model
                df_processed = preprocess(df.copy())
                
                # Select features for model
                available_features = [f for f in feature_names if f in df_processed.columns]
                if available_features:
                    X = df_processed.copy()
                    # Ensure all required features exist
                    for feat in feature_names:
                        if feat not in X.columns:
                            X[feat] = 0
                    
                    X = X[feature_names]
                    df["score"] = model.predict(X)
                    logger.info(f"✅ Model scoring completed - scores range: {df['score'].min():.2f} to {df['score'].max():.2f}")
                else:
                    # Fallback to simple scoring
                    logger.warning("No matching features found, using fallback scoring")
                    df["score"] = (
                        df.get("rating", pd.Series([0]*len(df))).fillna(0) * 0.7 +
                        (df.get("capacity", pd.Series([1]*len(df))).fillna(1) / 10) * 0.3
                    )
            except Exception as e:
                logger.warning(f"Model scoring failed: {e}, using fallback scoring")
                # Fallback to simple scoring
                df["score"] = (
                    df.get("rating", pd.Series([0]*len(df))).fillna(0) * 0.7 +
                    (df.get("capacity", pd.Series([1]*len(df))).fillna(1) / 10) * 0.3
                )
        else:
            logger.info("📉 Model not loaded, using fallback scoring formula")
            # Fallback scoring: rating (70%) + capacity (30%)
            df["score"] = (
                df.get("rating", pd.Series([0]*len(df))).fillna(0) * 0.7 +
                (df.get("capacity", pd.Series([1]*len(df))).fillna(1) / 10) * 0.3
            )

        # Sort by score descending
        df_sorted = df.sort_values("score", ascending=False)
        
        # Ensure _id exists for all results
        if "_id" not in df_sorted.columns:
            df_sorted = df_sorted.copy()
            df_sorted["_id"] = ["demo-" + str(i) for i in range(len(df_sorted))]
        
        # Select columns to include in results
        available_cols = ["_id", "name", "price", "rating", "capacity", "amenities", "score", "city", "location"]
        cols_to_select = [col for col in available_cols if col in df_sorted.columns]
        
        # Get ALL scored properties
        all_scored_properties = df_sorted[cols_to_select].to_dict(orient="records")
        
        # Get top K for quick access
        top_recommendations = df_sorted.head(top_k)[cols_to_select].to_dict(orient="records")
        
        logger.info(f"📝 Prepared {len(all_scored_properties)} scored properties, top {len(top_recommendations)} recommendations")
        logger.info(f"   - Top recommendations sample: {[r.get('name', 'N/A') for r in top_recommendations[:2]]}")
        logger.info(f"   - All scored properties count: {len(all_scored_properties)}")
        
        # Save ALL scored properties to recommendations.json
        saved_file = save_all_scored_properties(city_display, max_budget, top_recommendations, all_scored_properties)

        logger.info(f"✅ Saved {len(all_scored_properties)} scored properties to recommendations.json")
        
        response_data = {
            "recommendations": top_recommendations,
            "all_scored_properties": all_scored_properties,
            "total_properties_scored": len(all_scored_properties),
            "mode": "mongodb" if collection is not None else "demo",
            "saved": saved_file is not None,
            "saved_file": saved_file.split('\\')[-1] if saved_file else None
        }
        
        logger.info(f"✅ Response prepared with {len(response_data['all_scored_properties'])} properties")
        return response_data
    
    except Exception as e:
        logger.error(f"❌ Error in recommend: {e}", exc_info=True)
        return {
            "error": str(e),
            "recommendations": [],
            "all_scored_properties": [],
            "total_properties_scored": 0
        }

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

def save_recommendations_with_scores(city: str, max_budget: int, top_recommendations: list, all_scored_properties: list):
    """Save both top recommendations and all scored properties to recommendations.json"""
    try:
        # Always save to the same file: recommendations.json
        filepath = os.path.join(RECOMMENDATIONS_DIR, "recommendations.json")
        
        data = {
            "city": city,
            "max_budget": max_budget,
            "timestamp": datetime.now().isoformat(),
            "recommendations": top_recommendations,
            "all_scored_properties": all_scored_properties,
            "total_properties_scored": len(all_scored_properties),
            "top_k": len(top_recommendations)
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Saved {len(all_scored_properties)} scored properties and {len(top_recommendations)} top recommendations to {filepath}")
        return filepath
    except Exception as e:
        logger.error(f"Error saving recommendations with scores: {e}")
        return None

def save_all_scored_properties(city: str, max_budget: int, recommendations: list, all_scored_properties: list):
    """Save all scored properties to recommendations.json with proper structure"""
    try:
        filepath = os.path.join(RECOMMENDATIONS_DIR, "recommendations.json")
        
        data = {
            "city": city,
            "max_budget": max_budget,
            "timestamp": datetime.now().isoformat(),
            "recommendations": recommendations,
            "all_scored_properties": all_scored_properties,
            "stats": {
                "total_properties_scored": len(all_scored_properties),
                "top_recommendations": len(recommendations),
                "total_returned": len(recommendations) + len(all_scored_properties)
            }
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"✅ Saved ALL {len(all_scored_properties)} scored properties to recommendations.json")
        return filepath
    except Exception as e:
        logger.error(f"Error saving all scored properties: {e}")
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
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)