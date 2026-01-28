import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

def Recommender(data):
    pgs = data[0]
    user_pref = data[1]
    interactions = data[2]
    candidates = pgs[
        (pgs["price"] <= user_pref["max_budget"])
    ].copy()

    # print(f"Candidates: \n {candidates}")

    # -----------------------------
    # 5. Feature normalization
    # -----------------------------
    features = [
    "wifi", "food", "ac", "parking",
    "laundry", "power_backup", "security", "cctv",
    "vacancies", "price", "capacity", "rating"
    ]
    scaler = MinMaxScaler()
    # candidates[features] = scaler.fit_transform(candidates[features])

    # -----------------------------
    # 6. Build user profile from liked PGs
    # -----------------------------

    liked_pg_ids = interactions[interactions["liked"] == 1]["id"] # all the pgs that he liked
    user_vector = candidates[candidates["id"].isin(liked_pg_ids)][features]


    # print(f"User vector : \n{user_vector}")
    # Cold start handling
    if len(user_vector) == 0:
        user_vector = candidates[features].mean().values.reshape(1, -1)
    else:
        user_vector = user_vector.mean().values.reshape(1, -1)

    # -----------------------------
    # 7. Content similarity
    # -----------------------------
    candidates["content_score"] = cosine_similarity(
        candidates[features].values, user_vector
    )

    # print(f"Content score :\n {candidates['content_score']}")

    # -----------------------------
    # 8. Amenity match score
    # -----------------------------

    def amenity_score(row):
        return sum(row[a] for a in user_pref["required_amenities"])

    candidates["amenity_score"] = candidates.apply(amenity_score, axis=1)

    # -----------------------------
    # 9. Final hybrid ranking score
    # -----------------------------

    candidates["final_score"] = (
        0.6 * candidates["content_score"] +
        0.3 * candidates["amenity_score"]
    )

    # -----------------------------
    # 10. Top recommendations
    # -----------------------------
    recommendations = candidates.sort_values("final_score", ascending=False)

    # print("Recommended PGs:")
    # print(recommendations[["pg_id", "rent", "distance_km", "final_score"]])
    # print(recommendations)

    recommendations = recommendations.drop('_id', axis=1)
    return recommendations

