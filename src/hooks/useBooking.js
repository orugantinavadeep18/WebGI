import { useState } from "react";
import api from "../lib/api";

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = async (propertyId, bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.bookings.create({
        propertyId,
        ...bookingData,
      });
      if (!response.ok) {
        throw new Error(response.message || "Failed to create booking");
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOwnerRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.bookings.getOwnerRequests();
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch requests");
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRenterBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.bookings.getRenterBookings();
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch bookings");
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptBooking = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.bookings.accept(bookingId);
      if (!response.ok) {
        throw new Error(response.message || "Failed to accept booking");
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectBooking = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.bookings.reject(bookingId);
      if (!response.ok) {
        throw new Error(response.message || "Failed to reject booking");
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.bookings.cancel(bookingId);
      if (!response.ok) {
        throw new Error(response.message || "Failed to cancel booking");
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBooking,
    getOwnerRequests,
    getRenterBookings,
    acceptBooking,
    rejectBooking,
    cancelBooking,
  };
};
