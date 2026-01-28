from pymongo import MongoClient
import pandas as pd

user_pref = {
    "max_budget": 8000,
    "max_distance": 2.0,
    "required_amenities": ["wifi", "food"]
}

interactions = pd.DataFrame({
    "id": ["hst1", "hst3"],
    "liked": [1, 1]
})

def LoadData(collection):
    client = MongoClient("mongodb://localhost:27017/")

    db = client["WebGI"]
    collection = db[collection]


    cursor = collection.find({})

    pgs = pd.DataFrame(list(cursor))

    print(pgs)
    return [pgs, user_pref, interactions]
