import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { Calendar, Users, DollarSign, MessageSquare, Check, X, ArrowLeft } from "lucide-react";

export default function BookingRequests() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    getOwnerRequests,
    acceptBooking,
    rejectBooking,
    loading,
  } = useBooking();

  const [bookings, setBookings] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }
    loadBookings();
  }, [user, authLoading]);

  const loadBookings = async () => {
    try {
      console.log("📥 Loading booking requests...");
      const requests = await getOwnerRequests();
      console.log("✅ Booking requests loaded:", requests);
      setBookings(requests || []);
    } catch (error) {
      console.error("❌ Failed to load booking requests:", error);
      setBookings([]);
    }
  };

  const handleAccept = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await acceptBooking(bookingId);
      alert("Booking accepted!");
      await loadBookings();
    } catch (error) {
      alert("Error accepting booking: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await rejectBooking(bookingId);
      alert("Booking rejected!");
      await loadBookings();
    } catch (error) {
      alert("Error rejecting booking: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-gray-100 rounded-lg transition inline-flex items-center gap-2 text-gray-700"
          title="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-8">Booking Requests</h1>

        {authLoading || (loading && bookings.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading booking requests...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">No booking requests yet</p>
            <p className="text-gray-400 mt-2">When someone books your property, requests will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {/* Property */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {booking.property?.title || "Property"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.property?.description?.substring(0, 100)}...
                    </p>
                  </div>

                  {/* Dates & Guests */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Check-in</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Check-out</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Guests & Price */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Guests</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {booking.numberOfGuests}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Price</p>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <DollarSign className="h-4 w-4" />
                        ₹{((booking.totalPrice || 0) / 30).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>

                    {booking.status === "pending" && (
                      <div className="flex gap-2 mt-auto">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAccept(booking._id)}
                          disabled={processingId === booking._id}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(booking._id)}
                          disabled={processingId === booking._id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {booking.status === "accepted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-auto"
                        onClick={() => navigate("/messages")}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    )}
                  </div>
                </div>

                {/* Message from Renter */}
                {booking.message && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-600 mb-2">Message from {booking.renter?.name || "Guest"}:</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{booking.message}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
