import pandas as pd

def Loaddata():
    pgs = pd.DataFrame({
        "pg_id": [1, 2, 3, 4, 5, 6],
        "rent": [6000, 8000, 7500, 5000, 9000, 7000],
        "distance_km": [0.5, 1.2, 0.8, 2.5, 0.3, 1.0],
        "wifi": [1, 1, 0, 1, 1, 1],
        "food": [1, 0, 1, 1, 0, 1],
        "ac":   [0, 1, 0, 0, 1, 0]
    })

    # -----------------------------
    # 2. User preferences (explicit)
    # -----------------------------
    user_pref = {
        "max_budget": 8000,
        "max_distance": 2.0,
        "required_amenities": ["wifi", "food"]
    }

    # -----------------------------
    # 3. Past interactions (implicit)
    # liked = 1, disliked = 0
    # -----------------------------

    interactions = pd.DataFrame({
        "pg_id": [1, 3],
        "liked": [1, 0]
    })

    return [pgs, user_pref, interactions]
