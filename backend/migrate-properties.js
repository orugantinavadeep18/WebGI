import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./src/models/Property.js";
import User from "./src/models/User.js";

dotenv.config();

const migrateProperties = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find admin user
    const adminEmail = "kittu8441@gmail.com";
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.error(`❌ Admin user with email ${adminEmail} not found`);
      console.log("Creating admin user...");
      
      // Create admin user if doesn't exist
      const bcrypt = (await import("bcryptjs")).default;
      const hashedPassword = await bcrypt.hash("123456", 10);
      
      const newAdmin = new User({
        name: "Admin Kittu",
        email: adminEmail,
        password: hashedPassword,
        phone: "+91 XXXXX XXXXX",
        isVerified: true,
      });

      await newAdmin.save();
      console.log("✅ Admin user created:", newAdmin._id);
      
      // Now reassign all properties
      const result = await Property.updateMany(
        {},
        { $set: { seller: newAdmin._id } }
      );

      console.log(`✅ Migrated ${result.modifiedCount} properties to admin user ${newAdmin._id}`);
    } else {
      console.log("✅ Found admin user:", adminUser._id);

      // Reassign all properties to this admin
      const result = await Property.updateMany(
        {},
        { $set: { seller: adminUser._id } }
      );

      console.log(`✅ Migrated ${result.modifiedCount} properties to admin user ${adminUser._id}`);
    }

    // Show property count
    const totalProperties = await Property.countDocuments();
    console.log(`📊 Total properties in database: ${totalProperties}`);

    // Show all properties with their current sellers
    const properties = await Property.find({}).select("title seller");
    console.log("\n📋 All properties and their sellers:");
    properties.forEach((prop) => {
      console.log(`   - ${prop.title}: seller = ${prop.seller}`);
    });

    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

migrateProperties();
