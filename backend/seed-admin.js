import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "kittu8441@gmail.com" });
    if (adminExists) {
      console.log("Admin user already exists");
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = new User({
      name: "Admin",
      email: "kittu8441@gmail.com",
      password: "123456",
      phone: "+91-9876543210",
      address: "Admin Center",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      bio: "System Administrator",
      profileImage: "",
    });

    await admin.save();
    console.log("✅ Admin user created successfully");
    console.log("Email: kittu8441@gmail.com");
    console.log("Password: 123456");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
