import { useState } from "react";
import { apiCall } from "../lib/api";

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = async (propertyId, bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall("/bookings", {
        method: "POST",
        body: JSON.stringify({
          propertyId,
          ...bookingData,
        }),
      });
      return response.booking || response;
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
      const response = await apiCall("/bookings/owner/requests", {
        method: "GET",
      });
      console.log("✅ getOwnerRequests response:", response);
      const data = response.bookings || response || [];
      setError(null);
      return data;
    } catch (err) {
      console.error("❌ getOwnerRequests error:", err);
      const errorMsg = err.message || "Failed to fetch requests";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getRenterBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall("/bookings/renter/bookings", {
        method: "GET",
      });
      return response.bookings || [];
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
      const response = await apiCall(`/bookings/${bookingId}/accept`, {
        method: "PUT",
      });
      return response.booking || response;
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
      const response = await apiCall(`/bookings/${bookingId}/reject`, {
        method: "PUT",
      });
      return response.booking || response;
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
      const response = await apiCall(`/bookings/${bookingId}/cancel`, {
        method: "PUT",
      });
      return response.booking || response;
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
