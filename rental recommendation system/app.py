from fastapi import FastAPI
import pandas as pd

from recommender import Recommender
from loadfrommongo import LoadData
app = FastAPI()

@app.get("/recommend")
def recommend():
    # # 1. Load data (dummy / placeholder for now)
    # pgs = pd.DataFrame([
    #     {"pg_id": 1, "rent": 6000, "distance_km": 0.5, "wifi": 1, "food": 1, "ac": 0},
    #     {"pg_id": 2, "rent": 8000, "distance_km": 1.2, "wifi": 1, "food": 0, "ac": 1}
    # ])

    # user_pref = {
    #     "max_budget": 8000,
    #     "max_distance": 2.0,
    #     "required_amenities": ["wifi", "food"]
    # }

    # interactions = pd.DataFrame([
    #     {"pg_id": 1, "liked": 1}
    # ])

    db = LoadData()
    pgs = db[0]
    user_pref = db[1]
    interactions = db[2]

    # 2. Call recommender
    data = [pgs, user_pref, interactions]
    recommendations = Recommender(data)

    # 3. Return JSON response
    return recommendations.to_dict(orient="records")
