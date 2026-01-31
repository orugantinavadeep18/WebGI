import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useBooking } from "../../hooks/useBooking";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export default function BookingModal({ property, isOpen, onClose, onSuccess }) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBooking } = useBooking();
  const { user } = useAuth();

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayDate = getTodayDate();

  const handleCheckInDateChange = (e) => {
    const date = e.target.value;
    if (date && new Date(date) < new Date(todayDate)) {
      toast.error("Check-in date cannot be in the past");
      setCheckInDate(todayDate);
      return;
    }
    setCheckInDate(date);
  };

  const handleCheckOutDateChange = (e) => {
    const date = e.target.value;
    if (date && new Date(date) < new Date(todayDate)) {
      toast.error("Check-out date cannot be in the past");
      setCheckOutDate(todayDate);
      return;
    }
    setCheckOutDate(date);
  };

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const check_in = new Date(checkInDate);
      const check_out = new Date(checkOutDate);
      const nights = Math.ceil((check_out - check_in) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * ((property?.price || 0) / 30);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please log in to book a property");
      return;
    }

    if (!checkInDate || !checkOutDate || !numberOfGuests) {
      alert("Please fill in all required fields");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert("Check-out date must be after check-in date");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking(property._id, {
        checkInDate,
        checkOutDate,
        numberOfGuests,
        message,
      });
      alert("Booking request sent! The property owner will review it.");
      onSuccess?.();
      onClose();
      // Reset form
      setCheckInDate("");
      setCheckOutDate("");
      setNumberOfGuests(1);
      setMessage("");
    } catch (error) {
      alert("Error creating booking: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="max-w-md">
        <SheetHeader>
          <SheetTitle>Book {property?.title}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="checkIn">Check-in Date</Label>
            <Input
              id="checkIn"
              type="date"
              value={checkInDate}
              onChange={handleCheckInDateChange}
              min={todayDate}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkOut">Check-out Date</Label>
            <Input
              id="checkOut"
              type="date"
              value={checkOutDate}
              onChange={handleCheckOutDateChange}
              min={todayDate}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Owner (Optional)</Label>
            <textarea
              id="message"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Tell the owner about yourself or ask any questions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {nights > 0 && (
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  ₹{(Number(property?.price) / 30).toFixed(2)} × {Number(nights)} nights
                </span>

                <span className="font-semibold">
                  ₹{(Number(totalPrice)).toFixed(2)}
              </span>

              </div>
              <p className="text-xs text-gray-600">Total price</p>
            </div>
          )}

          <SheetFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !user}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Booking..." : "Book Now"}
            </Button>
          </SheetFooter>
        </form>

        {!user && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            Please log in to book this property.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
