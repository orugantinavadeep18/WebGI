# PG Recommendation System (Single-file demo)

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from loadfrommongo import LoadData
from recommender import Recommender
from xg_boost import Recommender_XGBoost

data = LoadData("Hostels")

# recommendations = Recommender(data)
recommendations = Recommender_XGBoost(data)

print(recommendations)
