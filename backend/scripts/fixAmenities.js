import mongoose from "mongoose";
import Property from "../src/models/Property.js";
import dotenv from "dotenv";

dotenv.config();

const amenityMap = {
  wifi: "WiFi",
  food: "Food Available",
  ac: "Air Conditioning",
  parking: "Parking",
  laundry: "Laundry",
  power_backup: "Power Backup",
  security: "Security",
  cctv: "CCTV",
};

const fixAmenities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/webgi");
    console.log("✅ Connected to MongoDB");

    // Get all properties
    const properties = await Property.find({});
    console.log(`📦 Found ${properties.length} properties`);

    let updatedCount = 0;

    for (const property of properties) {
      try {
        // Check if amenities is an object (old format) or array (new format)
        if (property.amenities && typeof property.amenities === 'object' && !Array.isArray(property.amenities)) {
          console.log(`\n🔧 Fixing property: "${property.title || property.name}"`);
          console.log(`   Old amenities (object):`, property.amenities);

          // Convert object to array of strings
          const amenitiesArray = Object.entries(property.amenities)
            .filter(([, value]) => value === true)
            .map(([key]) => amenityMap[key] || key.replace(/_/g, ' ').trim());

          console.log(`   New amenities (array):`, amenitiesArray);

          // Update the property
          await Property.findByIdAndUpdate(
            property._id,
            { 
              amenities: amenitiesArray,
              amenities_object: property.amenities // Keep the object for backward compatibility
            },
            { new: true }
          );

          updatedCount++;
          console.log(`   ✅ Updated`);
        } else if (!property.amenities || (Array.isArray(property.amenities) && property.amenities.length === 0)) {
          // If amenities is empty, try to populate from amenities_object
          if (property.amenities_object && typeof property.amenities_object === 'object') {
            const amenitiesArray = Object.entries(property.amenities_object)
              .filter(([, value]) => value === true)
              .map(([key]) => amenityMap[key] || key.replace(/_/g, ' ').trim());

            if (amenitiesArray.length > 0) {
              console.log(`\n🔄 Restoring amenities from object for: "${property.title || property.name}"`);
              console.log(`   Amenities:`, amenitiesArray);

              await Property.findByIdAndUpdate(
                property._id,
                { amenities: amenitiesArray },
                { new: true }
              );

              updatedCount++;
              console.log(`   ✅ Updated`);
            }
          }
        }
      } catch (err) {
        console.error(`❌ Error fixing property ${property._id}:`, err.message);
      }
    }

    console.log(`\n✅ Successfully fixed amenities for ${updatedCount} properties!`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixAmenities();
