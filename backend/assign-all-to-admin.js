import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./src/models/Property.js";
import User from "./src/models/User.js";

dotenv.config();

const assignAllPropertiesToAdmin = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find admin user
    const adminEmail = "kittu8441@gmail.com";
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.error(`❌ Admin user with email ${adminEmail} not found`);
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${adminUser._id}`);

    // Assign ALL properties (including migrated rentals) to admin
    const result = await Property.updateMany(
      {},
      { $set: { seller: adminUser._id } }
    );

    console.log(`\n✅ Assigned ${result.modifiedCount} properties to admin`);
    console.log(`ℹ️  Matched: ${result.matchedCount} properties`);

    // Show property count by type
    const totalProperties = await Property.countDocuments();
    console.log(`\n📊 Total properties in database: ${totalProperties}`);

    // Show count by property type
    const hostels = await Property.countDocuments({ property_type: "hostel" });
    const pgs = await Property.countDocuments({ property_type: "pg" });
    const others = await Property.countDocuments({ property_type: "others" });
    const apartments = await Property.countDocuments({ propertyType: "apartment" });
    
    console.log(`\n📋 Property breakdown:`);
    console.log(`   - Hostels: ${hostels}`);
    console.log(`   - PGs: ${pgs}`);
    console.log(`   - Others (rental): ${others}`);
    console.log(`   - Apartments (real estate): ${apartments}`);
    console.log(`   - Total: ${totalProperties}`);

    // Verify all have admin as seller
    const withoutAdmin = await Property.countDocuments({ seller: { $ne: adminUser._id } });
    console.log(`\n✅ Properties NOT owned by admin: ${withoutAdmin}`);

    console.log("\n✅ All properties now belong to admin (kittu8441@gmail.com)!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

assignAllPropertiesToAdmin();
