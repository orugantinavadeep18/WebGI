import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../src/models/Property.js";
import User from "../src/models/User.js";

dotenv.config();

const recreateAdminProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/webgi");
    console.log("✓ Connected to MongoDB");

    // Find admin user
    const adminUser = await User.findOne({ email: "kittu8441@gmail.com" });
    if (!adminUser) {
      console.error("❌ Admin user not found!");
      process.exit(1);
    }

    console.log(`✓ Found admin user: ${adminUser.email}`);

    // Delete existing properties from admin (only if they're test properties)
    const deleted = await Property.deleteMany({ 
      seller: adminUser._id,
      title: { $regex: "^(Modern PG|Luxury Hostel|Budget PG|Premium|Student Hostel|Corporate)" }
    });
    console.log(`✓ Deleted ${deleted.deletedCount} old test properties`);

    // Create 50+ realistic rental properties
    const properties = generateProperties(adminUser._id);

    const inserted = await Property.insertMany(properties);
    console.log(`✓ Created ${inserted.length} properties for admin`);

    // Show summary
    const totalCount = await Property.countDocuments();
    const adminCount = await Property.countDocuments({ seller: adminUser._id });
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ RECREATION COMPLETE");
    console.log("=".repeat(60));
    console.log(`Total properties in database: ${totalCount}`);
    console.log(`Admin's properties: ${adminCount}`);
    console.log("=".repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

function generateProperties(sellerId) {
  const properties = [];
  const cities = ["Hyderabad", "Bangalore", "Delhi", "Mumbai", "Chennai"];
  const types = ["pg", "hostel", "apartment", "others"];
  const genders = ["unisex", "male", "female"];
  const sharingTypes = ["single", "double", "triple", "shared"];
  
  const amenitiesList = [
    { wifi: true, food: true, ac: true, parking: true },
    { wifi: true, ac: true, parking: true, power_backup: true },
    { wifi: true, food: true, laundry: true, security: true },
    { ac: true, parking: true, power_backup: true, cctv: true },
    { wifi: true, food: true, ac: true, security: true },
  ];

  for (let i = 1; i <= 50; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const price = Math.floor(Math.random() * 8000) + 2000; // 2000 to 10000
    const capacity = Math.floor(Math.random() * 8) + 2; // 2 to 10
    const vacancies = Math.floor(Math.random() * capacity) + 1;
    const rating = Math.floor(Math.random() * 2 * 10) / 10 + 3; // 3 to 5
    const type = types[Math.floor(Math.random() * types.length)];
    const amenities = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];

    properties.push({
      title: `${type === "pg" ? "PG" : "Hostel"} Room ${i} in ${city}`,
      name: `Property ${i}`,
      description: `Beautiful ${type} accommodation in ${city} with all modern amenities. Perfect for professionals and students.`,
      about: `Well-maintained property with great location, good transport connectivity, and friendly management.`,
      price,
      property_type: type,
      propertyType: type,
      capacity,
      vacancies,
      address: `${Math.floor(Math.random() * 9000) + 1000} Main Street`,
      location: city,
      city,
      state: ["Telangana", "Karnataka", "Delhi", "Maharashtra", "Tamil Nadu"][cities.indexOf(city)],
      zipCode: String(Math.floor(Math.random() * 900000) + 100000),
      bedrooms: Math.floor(capacity / 2),
      bathrooms: Math.max(1, Math.floor(capacity / 3)),
      squareFeet: 500 + capacity * 150,
      amenities: Object.keys(amenities).filter(k => amenities[k]),
      amenities_object: amenities,
      rules: "No smoking, Quiet hours after 10 PM, Visitors on weekends only, Keep common areas clean",
      required_documents: "ID Proof, Address Proof, Deposit Receipt",
      owner_details: "Contact via portal or call +91-9999999999",
      gender_preference: genders[Math.floor(Math.random() * genders.length)],
      sharing_type: sharingTypes[Math.floor(Math.random() * sharingTypes.length)],
      status: Math.random() > 0.2 ? "available" : "pending",
      rating,
      views: Math.floor(Math.random() * 500),
      seller: sellerId,
      images: [
        {
          url: `https://via.placeholder.com/400x300?text=Property+${i}+Room`,
          uploadedAt: new Date(),
        },
        {
          url: `https://via.placeholder.com/400x300?text=Property+${i}+Common+Area`,
          uploadedAt: new Date(),
        },
      ],
    });
  }

  return properties;
}

recreateAdminProperties();
