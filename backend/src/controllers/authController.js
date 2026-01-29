import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    // Validate required fields
    if (!name || !email || !password || !securityQuestion || !securityAnswer) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(), // Normalize answer
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by email (for forgot password)
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        securityQuestion: user.securityQuestion,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state, zipCode, bio, profileImage } =
      req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address,
        city,
        state,
        zipCode,
        bio,
        profileImage,
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Admin-only access check
    const adminEmail = "kittu8441@gmail.com";
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser || currentUser.email !== adminEmail) {
      return res.status(403).json({ message: "Unauthorized: Admin access only" });
    }

    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    res.json({
      message: "All users retrieved successfully",
      users,
      total: users.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Admin-only access check
    const adminEmail = "kittu8441@gmail.com";
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser || currentUser.email !== adminEmail) {
      return res.status(403).json({ message: "Unauthorized: Admin access only" });
    }

    // Don't allow deleting self
    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    // Delete user's properties
    const Property = require("../models/Property").default || require("../models/Property");
    await Property.deleteMany({ ownerId: userId });

    // Delete user's bookings
    const Booking = require("../models/Booking").default || require("../models/Booking");
    await Booking.deleteMany({ $or: [{ renterId: userId }, { ownerId: userId }] });

    // Delete user's messages
    const Message = require("../models/Message").default || require("../models/Message");
    await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });

    // Delete user's direct messages
    const DirectMessage = require("../models/DirectMessage").default || require("../models/DirectMessage");
    await DirectMessage.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify security answer
export const verifySecurityAnswer = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;

    if (!email || !securityAnswer) {
      return res.status(400).json({ message: "Email and security answer required" });
    }

    const user = await User.findOne({ email }).select("+securityAnswer");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare security answers (case-insensitive, trimmed)
    const normalizedAnswer = securityAnswer.toLowerCase().trim();
    const isAnswerCorrect = user.securityAnswer === normalizedAnswer;

    if (!isAnswerCorrect) {
      return res.status(401).json({ message: "Security answer is incorrect" });
    }

    // Return a temporary token for password reset
    const resetToken = jwt.sign(
      { id: user._id, email: user.email, purpose: "passwordReset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token valid for 15 minutes
    );

    res.json({
      message: "Security answer verified",
      resetToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password with security answer verification
export const resetPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email }).select("+securityAnswer");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify security answer
    const normalizedAnswer = securityAnswer.toLowerCase().trim();
    if (user.securityAnswer !== normalizedAnswer) {
      return res.status(401).json({ message: "Security answer is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recreateUserAccount = async (req, res) => {
  try {
    const { email, name, password, securityQuestion, securityAnswer } = req.body;

    // Validate required fields
    if (!email || !name || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Delete existing user account
    await User.deleteOne({ email: email.toLowerCase() });

    // Create new user account
    const user = new User({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "Account recreated successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
