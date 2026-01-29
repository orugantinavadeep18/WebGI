import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import ImageKit from 'imagekit';
import mongoose from 'mongoose';

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Import models
import Property from '../src/models/Property.js';

async function uploadImagesToImageKit() {
  try {
    console.log('🚀 Starting image upload to ImageKit...\n');

    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all local images from public folder
    const publicDir = path.join(process.cwd(), '..', 'public');
    const imageFiles = fs.readdirSync(publicDir).filter(file =>
      file.startsWith('samplehstl') && file.endsWith('.avif')
    );

    console.log(`📸 Found ${imageFiles.length} local images to upload\n`);

    // Upload each image to ImageKit
    const uploadedImages = [];
    for (const file of imageFiles) {
      const filePath = path.join(publicDir, file);
      const fileContent = fs.readFileSync(filePath);

      console.log(`⬆️  Uploading ${file}...`);
      const response = await imagekit.upload({
        file: fileContent,
        fileName: file,
        folder: '/webgi-properties/'
      });

      uploadedImages.push({
        fileName: file,
        url: response.url,
        fileId: response.fileId
      });

      console.log(`✅ Uploaded: ${response.url}\n`);
    }

    console.log(`\n📊 Total uploaded: ${uploadedImages.length} images\n`);

    // Get all properties and assign 3 random images to each
    const properties = await Property.find({});
    console.log(`📍 Found ${properties.length} properties to assign images to\n`);

    let updateCount = 0;
    for (const property of properties) {
      // Shuffle and pick 3 random images
      const shuffled = uploadedImages.sort(() => Math.random() - 0.5);
      const assignedImages = shuffled.slice(0, 3).map(img => ({
        url: img.url,
        uploadedAt: new Date(),
        fileId: img.fileId
      }));

      // Update property with images
      await Property.findByIdAndUpdate(
        property._id,
        { $set: { images: assignedImages } },
        { new: true }
      );

      updateCount++;
      console.log(`✅ [${updateCount}/${properties.length}] ${property.name || property._id} - Assigned 3 images`);
    }

    console.log(`\n✨ SUCCESS! All ${updateCount} properties updated with ImageKit images\n`);
    console.log('🎉 Next step: Refresh your browser (Ctrl+Shift+R) to see the images\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

uploadImagesToImageKit();
