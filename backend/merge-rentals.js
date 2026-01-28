import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./src/models/Property.js";

dotenv.config();

const mergeRentalsToProperties = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get the Rental collection directly
    const db = mongoose.connection.db;
    const rentalCollection = db.collection("rentals");
    
    // Get all rentals
    const rentals = await rentalCollection.find({}).toArray();
    console.log(`📦 Found ${rentals.length} rentals to migrate`);

    if (rentals.length > 0) {
      console.log("Sample rental:", JSON.stringify(rentals[0], null, 2));

      // Directly copy rentals to properties collection
      if (rentals.length > 0) {
        const result = await db.collection("properties").insertMany(rentals, { ordered: false }).catch((err) => {
          if (err.code === 11000 || err.code === 11001) {
            // Duplicate key error
            console.log(`⚠️  Some rentals already exist in properties collection`);
            return { insertedCount: rentals.length - (err.writeErrors ? err.writeErrors.length : 0) };
          }
          throw err;
        });

        console.log(`✅ Migrated ${result?.insertedCount || rentals.length} rentals to properties collection`);
      }
    }

    // Show total properties
    const totalProperties = await Property.countDocuments();
    console.log(`\n📊 Total properties in database: ${totalProperties}`);

    // Show sample
    const samples = await Property.find().limit(3).lean();
    console.log("\n📋 Sample properties:");
    samples.forEach((p) => {
      console.log(`   - ${p.title || p.name || 'Untitled'}`);
    });

    console.log("\n✅ Merge complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

mergeRentalsToProperties();
