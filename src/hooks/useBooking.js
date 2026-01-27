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
      const response = await apiCall("/bookings/owner/requests", {
        method: "GET",
      });
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
      const response = await apiCall("/bookings/renter/bookings", {
        method: "GET",
      });
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
      const response = await apiCall(`/bookings/${bookingId}/accept`, {
        method: "PUT",
      });
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
      const response = await apiCall(`/bookings/${bookingId}/reject`, {
        method: "PUT",
      });
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
      const response = await apiCall(`/bookings/${bookingId}/cancel`, {
        method: "PUT",
      });
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
