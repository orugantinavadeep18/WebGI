import mongoose from "mongoose";
import Property from "../src/models/Property.js";
import dotenv from "dotenv";

dotenv.config();

// Image paths in public folder
const localImages = [
  "/samplehstl1.avif",
  "/samplehstl2.avif",
  "/samplehstl3.avif",
  "/samplehstl4.avif",
  "/samplehstl5.avif",
  "/samplehstl6.avif",
  "/samplehstl7.avif",
  "/samplehstl8.avif",
  "/samplehstl9.avif",
  "/samplehstl10.avif",
  "/samplehstl11.avif",
  "/samplehstl12.avif",
  "/samplehstl13.avif",
  "/samplehstl14.avif",
  "/samplehstl15.avif",
  "/samplehstl16.avif",
  "/samplehstl17.avif",
  "/samplehstl18.avif",
  "/samplehstl19.avif",
  "/samplehstl20.avif",
  "/samplehstl21.avif",
  "/samplehstl22.avif",
];

// Shuffle array function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const assignImagesToProperties = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/webgi");
    console.log("✅ Connected to MongoDB");

    // Get all existing properties
    const properties = await Property.find({});
    console.log(`📦 Found ${properties.length} properties`);

    if (properties.length === 0) {
      console.log("⚠️  No properties found in database");
      await mongoose.disconnect();
      return;
    }

    // Shuffle images
    const shuffledImages = shuffleArray(localImages);
    console.log(`🎲 Shuffled ${shuffledImages.length} images`);

    let imageIndex = 0;
    let updatedCount = 0;

    // Assign 3 images per property
    for (const property of properties) {
      const imagesToAssign = [];
      
      // Get next 3 images (cycling if necessary)
      for (let i = 0; i < 3; i++) {
        const image = shuffledImages[imageIndex % shuffledImages.length];
        imagesToAssign.push({
          url: image,
          uploadedAt: new Date(),
          fileId: `local-${property._id}-${i}`,
        });
        imageIndex++;
      }

      // Update property with images
      await Property.findByIdAndUpdate(
        property._id,
        { $set: { images: imagesToAssign } },
        { new: true }
      );

      updatedCount++;
      console.log(`✓ Property "${property.title}" updated with 3 images`);
    }

    console.log(`\n✅ Successfully assigned images to ${updatedCount} properties!`);
    console.log(`📊 Total images distributed: ${updatedCount * 3}`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error assigning images:", error);
    process.exit(1);
  }
};

// Run the script
assignImagesToProperties();
