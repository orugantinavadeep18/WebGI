# Quick Start Guide - WebGI Booking & Messaging System

## System is Now Ready! 🎉

Both frontend and backend are running:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:5000

## What's New?

### 1. **Booking System**
- Users can now book properties right from the property detail page
- Booking requests go to property owners
- Owners can accept or reject requests

### 2. **Messaging System**
- Chat interface for users to communicate about bookings
- View all conversations in one place
- Message history preserved per booking

### 3. **Navigation**
- New menu items: "Booking Requests" and "Messages"
- Available in the user dropdown menu (login required)

## Step-by-Step Test

### Step 1: Create Two Accounts
1. Go to http://localhost:8080
2. Click "Sign In"
3. Sign up with Account A (e.g., seller@example.com)
4. Sign out
5. Sign up with Account B (e.g., renter@example.com)

### Step 2: Create Property (Account A)
1. Sign back in as Account A
2. Click "List Your Property"
3. Fill in property details:
   - Title: "Beautiful 3BHK Apartment"
   - Description: "Nice apartment in city center"
   - Price: 50000 (₹)
   - Location: Your city
   - Property Type: PG
4. Add images (optional)
5. Click "Create Property"

### Step 3: View Property (Account B)
1. Sign out and sign in as Account B
2. Go to "Properties" or home page
3. Search/browse to find Account A's property
4. Click on property to view details

### Step 4: Book Property (Account B)
1. On property details page, click "Book Now"
2. Fill in booking form:
   - Check-in: 2026-02-15
   - Check-out: 2026-02-20
   - Number of Guests: 2
   - Message: "Hi, I'm interested in booking your property"
3. Click "Book Now"
4. Success! Booking request sent

### Step 5: Handle Booking Request (Account A)
1. Sign out and sign in as Account A
2. Click account menu → "Booking Requests"
3. See pending booking from Account B with:
   - Property name
   - Dates
   - Number of guests
   - Total price (5 nights × 50000 = 250000)
   - Message from renter
4. Click "Accept" to approve the booking

### Step 6: Chat (Both Accounts)
1. Both users go to account menu → "Messages"
2. Both see the booking conversation
3. Click on conversation to open chat
4. Exchange messages about the booking

## Key Points to Remember

✅ **No Mandatory Login for Browsing**
- You can view properties without signing in
- Only need to sign in to create properties or make bookings

✅ **Easy Booking**
- Click "Book Now" on any property detail page
- Select dates and submit
- Owner receives request immediately

✅ **Direct Communication**
- Once booking is accepted, both parties can chat
- Messages are linked to specific bookings

✅ **Owner Dashboard**
- "Booking Requests" shows all pending requests
- Accept or reject with one click

## Troubleshooting

### If Backend Won't Start
```bash
cd c:\Users\Navadeep\OneDrive\Desktop\webgi-main\backend
node src/server.js
```
Should see: "Server running on http://localhost:5000"

### If Frontend Won't Start
```bash
cd c:\Users\Navadeep\OneDrive\Desktop\webgi-main
npm run dev
```
Should see: "Local: http://localhost:8080/"

### If Booking Fails
1. Make sure you're signed in
2. Check browser console for errors
3. Verify backend is running
4. Check network tab in DevTools

### If Messages Don't Load
1. Verify booking has status "accepted"
2. Check if backend /api/messages endpoint is accessible
3. Refresh the messages page

## Files Added/Modified

### New Files Created:
- `src/components/property/BookingModal.jsx` - Booking form component
- `src/pages/Messages.jsx` - Chat interface
- `src/pages/BookingRequests.jsx` - Owner's dashboard
- `src/hooks/useBooking.js` - Booking logic hook
- `src/hooks/useMessages.js` - Messaging logic hook
- Backend: `src/models/Booking.js` - Booking database model
- Backend: `src/models/Message.js` - Message database model
- Backend: `src/controllers/bookingController.js` - Booking logic
- Backend: `src/controllers/messageController.js` - Messaging logic
- Backend: `src/routes/bookings.js` - Booking endpoints
- Backend: `src/routes/messages.js` - Message endpoints

### Files Modified:
- `src/pages/PropertyDetail.jsx` - Added "Book Now" button
- `src/App.jsx` - Added new routes
- `src/components/layout/Header.jsx` - Added menu items
- `src/lib/api.js` - Added booking & messaging endpoints
- Backend: `src/server.js` - Registered new routes

## Next Steps

1. **Deploy to Server**
   - Update API_BASE_URL in frontend for production
   - Deploy backend to cloud (Heroku, AWS, Railway, etc.)
   - Update MongoDB connection string

2. **Add More Features**
   - Payment integration (Razorpay, Stripe)
   - Email notifications
   - Review/rating system
   - Calendar booking view
   - Admin dashboard

3. **Security**
   - Add rate limiting
   - Implement CSRF protection
   - Add input validation
   - Encrypt sensitive data

## Contact & Support

For issues or questions about the booking/messaging system, check:
- Browser console for error messages
- Network tab to see API responses
- Backend logs in terminal

Happy booking! 🏠✨
