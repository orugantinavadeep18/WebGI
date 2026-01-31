import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Rental from "./src/models/Rental.js";
import connectDB from "./src/config/database.js";

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

// Parse CSV line
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function seedRentals() {
  try {
    await connectDB();
    console.log("📚 Starting Rental Data Seed...\n");

    // Check if data already exists
    const existingCount = await Rental.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} rentals.`);
      console.log("🔄 Clearing existing data...");
      await Rental.deleteMany({});
      console.log("✅ Cleared!\n");
    }

    // Read CSV file
    const csvPath = path.join(
      __dirname,
      "..",
      "rental recommendation system",
      "hostels.csv"
    );

    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at: ${csvPath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const lines = fileContent.trim().split("\n");
    const headers = parseCSVLine(lines[0]);

    console.log(`📖 CSV Headers: ${headers.join(", ")}`);
    console.log(`📊 Total records to import: ${lines.length - 1}\n`);

    const rentals = [];

    // Sample hostel images
    const sampleImages = [
      "/samplehstl1.avif",
      "/samplehstl2.avif",
      "/samplehstl3.avif",
      "/samplehstl4.avif",
      "/samplehstl5.avif",
      "/samplehstl6.avif",
    ];

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const row = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        // Map CSV to Rental model
        const rentalData = {
          id: parseInt(row.id) || 0,
          name: row.name || "Rental Property",
          location: row.location || "Unknown",
          description: row.about || "Cozy rental property",
          // Store amenities as both array of strings AND object for backward compatibility
          amenities: [
            Boolean(parseInt(row.wifi) || 0) && "WiFi",
            Boolean(parseInt(row.food) || 0) && "Food Available",
            Boolean(parseInt(row.ac) || 0) && "Air Conditioning",
            Boolean(parseInt(row.parking) || 0) && "Parking",
            Boolean(parseInt(row.laundry) || 0) && "Laundry",
            Boolean(parseInt(row.power_backup) || 0) && "Power Backup",
            Boolean(parseInt(row.security) || 0) && "Security",
            Boolean(parseInt(row.cctv) || 0) && "CCTV",
          ].filter(Boolean), // Remove false values
          amenities_object: {
            wifi: Boolean(parseInt(row.wifi) || 0),
            food: Boolean(parseInt(row.food) || 0),
            ac: Boolean(parseInt(row.ac) || 0),
            parking: Boolean(parseInt(row.parking) || 0),
            laundry: Boolean(parseInt(row.laundry) || 0),
            power_backup: Boolean(parseInt(row.power_backup) || 0),
            security: Boolean(parseInt(row.security) || 0),
            cctv: Boolean(parseInt(row.cctv) || 0),
          },
          price: parseInt(row.price) || 0,
          property_type: row.property_type || "others",
          capacity: parseInt(row.capacity) || 1,
          rating: isNaN(parseFloat(row.rating)) ? 0 : parseFloat(row.rating),
          vacancies: parseInt(row.vacancies) || 0,
          owner_details: row.owner_details || "Property Owner",
          rules: row.rules || "Standard house rules apply",
          required_documents: row.required_documents || "ID proof required",
          gender_preference: "unisex", // Default to unisex
          sharing_type: (parseInt(row.capacity) || 1) > 2 ? "shared" : "single", // Infer from capacity
          is_selected: false,
          // Cycle through sample images
          images: [sampleImages[(i - 1) % sampleImages.length]],
        };

        rentals.push(rentalData);

        if (i % 50 === 0) {
          console.log(`   Processed ${i} records...`);
        }
      } catch (error) {
        console.error(`   ⚠️  Error parsing row ${i}:`, error.message);
      }
    }

    // Insert into database
    console.log(`\n📝 Inserting ${rentals.length} rentals into database...`);
    const result = await Rental.insertMany(rentals, { ordered: true });

    console.log(`\n✅ Seed completed successfully!`);
    console.log(`📊 Total rentals inserted: ${result.length}`);

    // Display sample data
    if (result.length > 0) {
      console.log("\n📋 Sample Rentals (First 3):");
      console.log("=".repeat(60));
      const samples = result.slice(0, 3);
      samples.forEach((rental, index) => {
        console.log(`\n${index + 1}. ${rental.name} - ${rental.location}`);
        console.log(
          `   💰 Price: ₹${rental.price} | ⭐ Rating: ${rental.rating}`
        );
        console.log(
          `   🏠 Type: ${rental.property_type} | 👥 Capacity: ${rental.capacity}`
        );
        console.log(`   📍 Vacancies: ${rental.vacancies}`);
      });
    } else {
      // Fetch from DB if insertMany didn't return documents
      const samples = await Rental.find().limit(3);
      if (samples.length > 0) {
        console.log("\n📋 Sample Rentals (First 3):");
        console.log("=".repeat(60));
        samples.forEach((rental, index) => {
          console.log(`\n${index + 1}. ${rental.name} - ${rental.location}`);
          console.log(
            `   💰 Price: ₹${rental.price} | ⭐ Rating: ${rental.rating}`
          );
          console.log(
            `   🏠 Type: ${rental.property_type} | 👥 Capacity: ${rental.capacity}`
          );
          console.log(`   📍 Vacancies: ${rental.vacancies}`);
        });
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ Database ready for recommendations!");
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedRentals();
