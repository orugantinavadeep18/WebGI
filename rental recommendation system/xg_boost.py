import pandas as pd
import numpy as np
import xgboost as xgb


def Recommender_XGBoost(data):
    pgs, user_pref, interactions = data

    # -----------------------------
    # 1. Hard filtering
    # -----------------------------
    candidates = pgs[
        (pgs["price"] <= user_pref["max_budget"])
    ].copy()

    if candidates.empty:
        return candidates

    # -----------------------------
    # 2. Ensure ID dtype consistency (FIX)
    # -----------------------------
    candidates["id"] = candidates["id"].astype(str)
    interactions["id"] = interactions["id"].astype(str)

    # -----------------------------
    # 3. Feature set
    # -----------------------------
    features = [
        "wifi", "food", "ac", "parking",
        "laundry", "power_backup", "security", "cctv",
        "vacancies", "price", "capacity", "rating"
    ]

    # -----------------------------
    # 4. Prepare training data
    # -----------------------------
    train_df = candidates.merge(
        interactions[["id", "liked"]],
        on="id",
        how="left"
    )

    train_df["liked"] = train_df["liked"].fillna(0)

    X_train = train_df[features]
    y_train = train_df["liked"]

    # One group = one user
    group = [len(train_df)]

    # -----------------------------
    # 5. Train XGBoost ranker
    # -----------------------------
    model = xgb.XGBRanker(
        objective="rank:pairwise",
        learning_rate=0.1,
        max_depth=5,
        n_estimators=100,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    model.fit(X_train, y_train, group=group)

    # -----------------------------
    # 6. Predict ranking scores
    # -----------------------------
    candidates["rank_score"] = model.predict(
        candidates[features]
    )

    # -----------------------------
    # 7. Amenity match score
    # -----------------------------
    def amenity_score(row):
        return sum(row[a] for a in user_pref["required_amenities"])

    candidates["amenity_score"] = candidates.apply(amenity_score, axis=1)

    # -----------------------------
    # 8. Final hybrid score
    # -----------------------------
    candidates["final_score"] = (
        0.7 * candidates["rank_score"] +
        0.3 * candidates["amenity_score"]
    )

    # -----------------------------
    # 9. Sort & clean output
    # -----------------------------
    recommendations = candidates.sort_values(
        "final_score", ascending=False
    )

    if "_id" in recommendations.columns:
        recommendations = recommendations.drop("_id", axis=1)

    return recommendations

