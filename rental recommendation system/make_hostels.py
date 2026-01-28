import random
import csv

file_path = "hostels.csv"

headers = [
    "id", "name", "location", "about",
    "wifi", "food", "ac", "parking",
    "laundry", "power_backup", "security", "cctv",
    "rules", "required_documents", "owner_details",
    "vacancies", "price", "property_type", "capacity", "rating"
]

with open(file_path, "a", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    # writer.writerow(headers)

    for i in range(50):
        hostel_id = i
        name = f"hst{i}"
        location = "banglore"
        about = "some description"

        # 8 amenities as binary columns (BEST PRACTICE)
        amenities = [random.randint(0, 1) for _ in range(8)]

        rules = "some rules"
        required_documents = "documents required"
        owner_details = "owner_details"
        vacancies = random.randint(0, 3)

        price = int(max(2000, min(random.gauss(4000, 2000), 12000)))

        property_type = random.choice(["hostel", "pg", "others"])
        capacity = random.randint(1, 4)
        rating = random.randint(1, 10)/2
        row = [
            hostel_id, name, location, about,
            *amenities,
            rules, required_documents, owner_details,
            vacancies, price, property_type, capacity, rating
        ]

        writer.writerow(row)
