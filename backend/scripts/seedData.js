import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../src/models/Property.js";
import User from "../src/models/User.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/webgi");
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await Property.deleteMany({});
    console.log("✓ Cleared existing properties");

    // Get or create a test seller
    let seller = await User.findOne({ email: "test@rental.com" });
    if (!seller) {
      seller = await User.create({
        email: "test@rental.com",
        password: "123456",
        name: "Test Seller",
      });
      console.log("✓ Created test seller user");
    }

    // Create test rental properties
    const testProperties = [
      {
        title: "Modern PG in Hyderabad",
        name: "Modern PG",
        description: "Comfortable shared living space with modern amenities",
        about: "Brand new PG facility with WiFi, food, and AC in all rooms",
        price: 4500,
        property_type: "pg",
        propertyType: "pg",
        capacity: 10,
        vacancies: 3,
        address: "123 Main Street",
        location: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500001",
        bedrooms: 0,
        bathrooms: 2,
        squareFeet: 2000,
        amenities: ["WiFi", "Food", "AC", "Parking"],
        amenities_object: {
          wifi: true,
          food: true,
          ac: true,
          parking: true,
          laundry: false,
          power_backup: true,
          security: true,
          cctv: true,
        },
        rules: "No smoking, Quiet hours after 10 PM, Visitors allowed on weekends only",
        required_documents: "ID Proof, Aadhaar Card, College ID",
        owner_details: "Raj Kumar, +91-9999999999, raj@gmail.com",
        gender_preference: "unisex",
        sharing_type: "double",
        status: "available",
        rating: 4.5,
        views: 150,
        seller: seller._id,
        images: [
          {
            url: "https://via.placeholder.com/400x300?text=PG+Room+1",
            uploadedAt: new Date(),
          },
          {
            url: "https://via.placeholder.com/400x300?text=PG+Room+2",
            uploadedAt: new Date(),
          },
        ],
      },
      {
        title: "Luxury Hostel - Female Only",
        name: "Luxury Hostel",
        description: "Premium hostel with private and shared rooms",
        about: "High-end hostel for female travelers with excellent amenities and security",
        price: 3500,
        property_type: "hostel",
        propertyType: "hostel",
        capacity: 25,
        vacancies: 5,
        address: "456 Park Road",
        location: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500002",
        bedrooms: 0,
        bathrooms: 5,
        squareFeet: 5000,
        amenities: ["WiFi", "Food", "AC", "Laundry", "Security"],
        amenities_object: {
          wifi: true,
          food: true,
          ac: true,
          parking: false,
          laundry: true,
          power_backup: true,
          security: true,
          cctv: true,
        },
        rules: "Strict security, No outside guests, Curfew at 12 AM",
        required_documents: "ID Proof, Passport/Visa",
        owner_details: "Priya Sharma, +91-8888888888, priya@hostel.com",
        gender_preference: "female",
        sharing_type: "shared",
        status: "available",
        rating: 4.8,
        views: 280,
        seller: seller._id,
        images: [
          {
            url: "https://via.placeholder.com/400x300?text=Hostel+Common",
            uploadedAt: new Date(),
          },
          {
            url: "https://via.placeholder.com/400x300?text=Hostel+Room",
            uploadedAt: new Date(),
          },
        ],
      },
      {
        title: "Budget PG Near Tech Park",
        name: "Budget PG",
        description: "Affordable accommodation near major IT offices",
        about: "Cost-effective PG perfect for professionals working in tech parks",
        price: 2800,
        property_type: "pg",
        propertyType: "pg",
        capacity: 8,
        vacancies: 2,
        address: "789 Tech Avenue",
        location: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500003",
        bedrooms: 0,
        bathrooms: 2,
        squareFeet: 1200,
        amenities: ["WiFi", "Power Backup", "Security"],
        amenities_object: {
          wifi: true,
          food: false,
          ac: false,
          parking: false,
          laundry: false,
          power_backup: true,
          security: true,
          cctv: false,
        },
        rules: "No pets, Keep rooms clean, No late night parties",
        required_documents: "ID Proof, Pan Card, Deposit",
        owner_details: "Arjun Singh, +91-7777777777, arjun@pg.com",
        gender_preference: "unisex",
        sharing_type: "triple",
        status: "available",
        rating: 3.8,
        views: 95,
        seller: seller._id,
        images: [
          {
            url: "https://via.placeholder.com/400x300?text=Budget+Room",
            uploadedAt: new Date(),
          },
        ],
      },
      {
        title: "Premium Single Room Hostel",
        name: "Premium Single Hostel",
        description: "Single occupancy rooms with premium facilities",
        about: "Luxury single rooms with private bathroom and balcony",
        price: 6500,
        property_type: "hostel",
        propertyType: "hostel",
        capacity: 12,
        vacancies: 4,
        address: "321 Elite Street",
        location: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500004",
        bedrooms: 0,
        bathrooms: 12,
        squareFeet: 3000,
        amenities: ["WiFi", "Food", "AC", "Parking", "Laundry", "Power Backup", "Security", "CCTV"],
        amenities_object: {
          wifi: true,
          food: true,
          ac: true,
          parking: true,
          laundry: true,
          power_backup: true,
          security: true,
          cctv: true,
        },
        rules: "Professional atmosphere, No smoking/drinking, Quiet hours after 11 PM",
        required_documents: "ID Proof, Company Certificate, Deposit",
        owner_details: "Vikram Patel, +91-6666666666, vikram@premium.com",
        gender_preference: "unisex",
        sharing_type: "single",
        status: "available",
        rating: 4.9,
        views: 320,
        seller: seller._id,
        images: [
          {
            url: "https://via.placeholder.com/400x300?text=Premium+Room",
            uploadedAt: new Date(),
          },
          {
            url: "https://via.placeholder.com/400x300?text=Premium+Bathroom",
            uploadedAt: new Date(),
          },
          {
            url: "https://via.placeholder.com/400x300?text=Premium+Balcony",
            uploadedAt: new Date(),
          },
        ],
      },
      {
        title: "Student Hostel - Male",
        name: "Student Hostel",
        description: "Affordable hostel specifically for college students",
        about: "Budget-friendly hostel with study areas and recreational facilities",
        price: 2200,
        property_type: "hostel",
        propertyType: "hostel",
        capacity: 30,
        vacancies: 8,
        address: "654 College Lane",
        location: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500005",
        bedrooms: 0,
        bathrooms: 6,
        squareFeet: 4000,
        amenities: ["WiFi", "Power Backup", "Security"],
        amenities_object: {
          wifi: true,
          food: false,
          ac: false,
          parking: false,
          laundry: false,
          power_backup: true,
          security: true,
          cctv: true,
        },
        rules: "Strict curfew 1 AM, No outside guests on weekdays, Keep common areas clean",
        required_documents: "College ID, Parent Contact, Deposit",
        owner_details: "Suresh Kumar, +91-5555555555, suresh@student.com",
        gender_preference: "male",
        sharing_type: "shared",
        status: "available",
        rating: 3.5,
        views: 160,
        seller: seller._id,
        images: [
          {
            url: "https://via.placeholder.com/400x300?text=Student+Dorm",
            uploadedAt: new Date(),
          },
        ],
      },
      {
        title: "Corporate Housing - Female",
        name: "Corporate Housing",
        description: "Premium corporate housing for working professionals",
        about: "Fully furnished corporate housing with all modern conveniences",
        price: 7500,
        property_type: "pg",
        propertyType: "pg",
        capacity: 6,
        vacancies: 1,
        address: "987 Business Park",
        location: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500006",
        bedrooms: 0,
        bathrooms: 3,
        squareFeet: 2500,
        amenities: ["WiFi", "Food", "AC", "Parking", "Laundry", "Power Backup", "Security", "CCTV"],
        amenities_object: {
          wifi: true,
          food: true,
          ac: true,
          parking: true,
          laundry: true,
          power_backup: true,
          security: true,
          cctv: true,
        },
        rules: "Professional environment, No parties, Maintenance of decorum required",
        required_documents: "Company ID, Salary Certificate, References",
        owner_details: "Deepa Menon, +91-4444444444, deepa@corporate.com",
        gender_preference: "female",
        sharing_type: "double",
        status: "available",
        rating: 4.7,
        views: 210,
        seller: seller._id,
        images: [
          {
            url: "https://via.placeholder.com/400x300?text=Corporate+Suite",
            uploadedAt: new Date(),
          },
          {
            url: "https://via.placeholder.com/400x300?text=Corporate+Lounge",
            uploadedAt: new Date(),
          },
        ],
      },
    ];

    // Insert test data
    const insertedProperties = await Property.insertMany(testProperties);
    console.log(`✓ Created ${insertedProperties.length} test properties`);

    // Display summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 SEED DATA SUMMARY");
    console.log("=".repeat(60));
    insertedProperties.forEach((prop, index) => {
      console.log(
        `${index + 1}. ${prop.title} | ₹${prop.price} | ${prop.property_type} | ⭐${prop.rating}`
      );
    });
    console.log("=".repeat(60));
    console.log("✓ Database seeding completed successfully!");

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
