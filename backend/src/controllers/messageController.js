import Message from "../models/Message.js";
import Booking from "../models/Booking.js";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { bookingId, receiverId, content } = req.body;
    const senderId = req.user.id;

    // Validate
    if (!bookingId || !receiverId || !content) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Verify booking exists and user is part of it
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if sender is part of this booking
    if (
      booking.propertyOwner !== senderId &&
      booking.renter !== senderId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if receiver is the other party in booking
    if (
      receiverId !== booking.propertyOwner &&
      receiverId !== booking.renter
    ) {
      return res.status(400).json({ message: "Invalid receiver" });
    }

    // Create message
    const message = new Message({
      booking: bookingId,
      sender: senderId,
      receiver: receiverId,
      content,
      isRead: false,
    });

    await message.save();

    res.status(201).json({
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a booking
export const getBookingMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check access
    if (
      booking.propertyOwner.toString() !== userId &&
      booking.renter.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ booking: bookingId })
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { booking: bookingId, receiver: userId, isRead: false },
      { isRead: true }
    );

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all bookings where user is involved
    const bookings = await Booking.find({
      $or: [{ propertyOwner: userId }, { renter: userId }],
    });

    const conversations = await Promise.all(
      bookings.map(async (booking) => {
        const lastMessage = await Message.findOne({ booking: booking._id })
          .sort({ createdAt: -1 });

        const otherPartyId =
          booking.propertyOwner === userId
            ? booking.renter
            : booking.propertyOwner;

        const unreadCount = await Message.countDocuments({
          booking: booking._id,
          receiver: userId,
          isRead: false,
        });

        return {
          bookingId: booking._id,
          property: booking.property,
          otherPartyId,
          lastMessage: lastMessage ? lastMessage.content : "No messages yet",
          lastMessageTime: lastMessage ? lastMessage.createdAt : booking.createdAt,
          unreadCount,
          bookingStatus: booking.status,
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
