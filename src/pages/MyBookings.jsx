import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, User, Phone, Mail, Trash2, Check, X, Clock, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, accepted, rejected

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    fetchBookings();
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/bookings/renter/bookings", {
        method: "GET",
      });
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await apiCall(`/bookings/${bookingId}/cancel`, {
        method: "PUT",
      });
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      accepted: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
      cancelled: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      accepted: <Check className="h-4 w-4" />,
      rejected: <X className="h-4 w-4" />,
      cancelled: <X className="h-4 w-4" />,
    };
    return icons[status];
  };

  const filteredBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter
  );

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">Please log in to view your bookings</p>
            <Button onClick={() => navigate("/auth")} className="bg-primary">
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition inline-flex items-center gap-2 text-gray-700 mb-4"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">My Bookings</h1>
            </div>
            <p className="text-white/80">
              {filteredBookings.length} {filteredBookings.length === 1 ? "booking" : "bookings"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "pending", "accepted", "rejected", "cancelled"].map(
              (status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              )
            )}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Bookings Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start booking properties and manage them here!
              </p>
              <Button
                onClick={() => navigate("/properties")}
                className="gap-2 bg-primary"
              >
                Browse Properties
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Booking Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        {booking.propertyTitle || "Property"}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                            {new Date(booking.checkOutDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{booking.guests} Guest(s)</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Property Owner</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {booking.ownerName || "Owner"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {booking.ownerPhone || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 truncate">
                            {booking.ownerEmail || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Amount */}
                    <div>
                      <div className="mb-4">
                        <Badge className={`${getStatusColor(booking.status)} border`}>
                          <span className="mr-1">{getStatusIcon(booking.status)}</span>
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">
                          ₹{(booking.totalPrice || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/messages/${booking.ownerId}`)}
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Message Owner
                    </Button>
                    {booking.status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelBooking(booking._id)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
