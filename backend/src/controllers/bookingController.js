import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

// Create a booking request
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate, numberOfGuests, message } =
      req.body;
    const renterId = req.user.id;

    // Validate required fields
    if (!propertyId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Get property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user is not the owner
    if (property.seller.toString() === renterId) {
      return res
        .status(400)
        .json({ message: "Cannot book your own property" });
    }

    // Calculate total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;

    // Create booking
    const booking = new Booking({
      property: propertyId,
      propertyOwner: property.seller,
      renter: renterId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      message,
      status: "pending",
    });

    await booking.save();
    await booking.populate([
      { path: "property", select: "title price" },
      { path: "propertyOwner", select: "name email phone" },
      { path: "renter", select: "name email phone" },
    ]);

    res.status(201).json({
      message: "Booking request created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking requests for property owner
export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const bookings = await Booking.find({ propertyOwner: ownerId })
      .populate("property", "title price address city")
      .populate("renter", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for renter
export const getRenterBookings = async (req, res) => {
  try {
    const renterId = req.user.id;

    const bookings = await Booking.find({ renter: renterId })
      .populate("property", "title price address city")
      .populate("propertyOwner", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate("property")
      .populate("propertyOwner", "name email phone")
      .populate("renter", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check access: only owner or renter can view
    if (
      booking.propertyOwner._id.toString() !== userId &&
      booking.renter._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept booking request
export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const ownerId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only owner can accept
    if (booking.propertyOwner.toString() !== ownerId) {
      return res.status(403).json({ message: "Only property owner can accept" });
    }

    booking.status = "accepted";
    booking.updatedAt = new Date();
    await booking.save();

    await booking.populate([
      { path: "property", select: "title" },
      { path: "renter", select: "name email" },
    ]);

    res.json({ message: "Booking accepted", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject booking request
export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const ownerId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only owner can reject
    if (booking.propertyOwner.toString() !== ownerId) {
      return res.status(403).json({ message: "Only property owner can reject" });
    }

    booking.status = "rejected";
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ message: "Booking rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only renter can cancel
    if (booking.renter.toString() !== userId) {
      return res.status(403).json({ message: "Only renter can cancel" });
    }

    if (booking.status === "accepted" || booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel accepted booking" });
    }

    booking.status = "cancelled";
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
