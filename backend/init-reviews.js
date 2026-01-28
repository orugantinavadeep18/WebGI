import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./src/models/Property.js";

dotenv.config();

const initializeReviewsForAllProperties = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find all properties without ratings array
    const propsWithoutRatings = await Property.countDocuments({
      ratings: { $exists: false }
    });
    
    console.log(`\n📊 Properties without ratings array: ${propsWithoutRatings}`);

    // Initialize ratings array for all properties
    const result = await Property.updateMany(
      { ratings: { $exists: false } },
      { $set: { ratings: [] } }
    );

    console.log(`✅ Initialized ratings for ${result.modifiedCount} properties`);

    // Verify all properties have ratings
    const totalWithRatings = await Property.countDocuments({
      ratings: { $exists: true }
    });

    const total = await Property.countDocuments();

    console.log(`\n📋 Total properties: ${total}`);
    console.log(`✅ Properties with ratings field: ${totalWithRatings}`);

    if (totalWithRatings === total) {
      console.log("\n✅ SUCCESS: All properties have review system enabled!");
    }

    // Show sample
    const samples = await Property.find({ ratings: { $exists: true } })
      .select("title name rating ratings")
      .limit(3)
      .lean();

    console.log("\n📋 Sample properties with review system:");
    samples.forEach(p => {
      console.log(`   - ${p.title || p.name}`);
      console.log(`     Rating: ${p.rating || 0}, Reviews: ${(p.ratings || []).length}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

initializeReviewsForAllProperties();
