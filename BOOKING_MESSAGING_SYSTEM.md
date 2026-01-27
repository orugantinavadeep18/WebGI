# WebGI - Complete Booking & Messaging System

## Overview

This document describes the complete booking and messaging system integrated into the WebGI property rental platform.

## System Architecture

### Frontend Components

#### 1. **BookingModal** (`src/components/property/BookingModal.jsx`)
- Modal dialog for making property booking requests
- Shows property details and calculates total price (nights × property price)
- Fields:
  - Check-in Date
  - Check-out Date
  - Number of Guests
  - Message to Owner (optional)
- Automatically calculates and displays total price
- Only available to logged-in users

#### 2. **Messages Page** (`src/pages/Messages.jsx`)
- Chat interface for users to communicate about bookings
- Split view:
  - **Left Panel**: List of all conversations
  - **Right Panel**: Active chat window
- Features:
  - Shows last message and unread count for each conversation
  - Real-time message display
  - Message timestamps
  - Send/receive messages
  - Auto-refresh when new messages are sent

#### 3. **BookingRequests Page** (`src/pages/BookingRequests.jsx`)
- Dashboard for property owners to manage booking requests
- Displays all pending, accepted, rejected, and completed bookings
- Shows:
  - Property name and description
  - Check-in and check-out dates
  - Number of guests
  - Total price
  - Booking status with color coding
  - Message from the renter
- Actions for pending bookings:
  - **Accept**: Approve the booking request
  - **Reject**: Decline the booking request
- Accepted bookings show "Message" button to chat with renter

#### 4. **Updated PropertyDetail** (`src/pages/PropertyDetail.jsx`)
- "Book Now" button in the property sidebar
- Opens BookingModal when clicked
- Only accessible to logged-in users

### Custom Hooks

#### 1. **useBooking** (`src/hooks/useBooking.js`)
```javascript
const {
  loading,
  error,
  createBooking,
  getOwnerRequests,
  getRenterBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
} = useBooking();
```

- Manages all booking-related API calls
- Handles loading and error states
- Methods:
  - `createBooking(propertyId, bookingData)` - Create new booking request
  - `getOwnerRequests()` - Get all booking requests for owned properties
  - `getRenterBookings()` - Get all bookings made by user
  - `acceptBooking(bookingId)` - Accept a booking request
  - `rejectBooking(bookingId)` - Reject a booking request
  - `cancelBooking(bookingId)` - Cancel a booking

#### 2. **useMessages** (`src/hooks/useMessages.js`)
```javascript
const {
  loading,
  error,
  messages,
  conversations,
  unreadCount,
  sendMessage,
  getBookingMessages,
  getConversations,
  getUnreadCount,
} = useMessages();
```

- Manages all messaging-related API calls
- Auto-refreshes messages when sent
- Methods:
  - `sendMessage(bookingId, receiverId, content)` - Send a message
  - `getBookingMessages(bookingId)` - Fetch messages for a booking
  - `getConversations()` - Get all conversations with unread counts
  - `getUnreadCount()` - Get total unread message count

### API Layer

Added to `src/lib/api.js`:

```javascript
api.bookings: {
  create, getOwnerRequests, getRenterBookings, getBooking,
  accept, reject, cancel
}

api.messages: {
  send, getBookingMessages, getConversations, getUnreadCount
}
```

## Backend API Endpoints

### Booking Endpoints (All require JWT authentication)

**Base URL**: `http://localhost:5000/api/bookings`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new booking request |
| GET | `/owner/requests` | Get all booking requests for owned properties |
| GET | `/renter/bookings` | Get all bookings made by user |
| GET | `/:bookingId` | Get single booking details |
| PUT | `/:bookingId/accept` | Accept a booking request |
| PUT | `/:bookingId/reject` | Reject a booking request |
| PUT | `/:bookingId/cancel` | Cancel a booking |

### Message Endpoints (All require JWT authentication)

**Base URL**: `http://localhost:5000/api/messages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Send a message |
| GET | `/booking/:bookingId` | Get all messages for a booking |
| GET | `/conversations/all` | Get all conversations with metadata |
| GET | `/unread/count` | Get total unread message count |

## Database Models

### Booking Model
```javascript
{
  property: ObjectId,           // Reference to Property
  propertyOwner: ObjectId,      // Reference to User (property owner)
  renter: ObjectId,             // Reference to User (who made the booking)
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  totalPrice: Number,           // Calculated: nights × property.price
  message: String,              // Optional message from renter
  status: String,               // pending, accepted, rejected, completed, cancelled
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  booking: ObjectId,            // Reference to Booking
  sender: ObjectId,             // Reference to User
  receiver: ObjectId,           // Reference to User
  content: String,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Workflow

### 1. **Property Listing**
- Any logged-in user can create a property
- Property is stored in MongoDB with seller reference
- Property appears immediately in listings

### 2. **Booking Request**
- User views property details
- User clicks "Book Now"
- Modal opens with booking form
- User fills in check-in, check-out, guests, and optional message
- Total price calculated: (checkOut - checkIn) × propertyPrice
- POST request sent to `/api/bookings`
- Booking created with status: `pending`

### 3. **Owner Receives Request**
- Property owner navigates to "Booking Requests" in menu
- Sees all pending requests for their properties
- Shows:
  - Property name
  - Guest dates
  - Number of guests
  - Total price
  - Message from renter (if any)

### 4. **Owner Accepts/Rejects**
- Owner clicks "Accept" or "Reject"
- Booking status changes:
  - Accept → `accepted`
  - Reject → `rejected`
- Booking request is removed from pending list
- If accepted, owner can now message the renter

### 5. **Communication**
- Owner and renter both navigate to "Messages"
- See list of all conversations (active bookings)
- Click on a conversation to open chat
- Can send/receive messages in real-time
- Messages linked to specific booking for context

### 6. **Booking Completion**
- Once stay is completed, booking can be marked as `completed`
- Once cancelled, booking is marked as `cancelled`

## Navigation Integration

### Header Menu Updates
- Added "Booking Requests" link (for property owners)
- Added "Messages" link (for all users with active bookings)
- Links appear in dropdown when user is logged in

### New Routes
- `/booking-requests` - Owner's booking requests dashboard
- `/messages` - Chat interface for conversations

## Key Features

✅ **Non-Mandatory Authentication**
- Browsing properties doesn't require login
- Only booking and posting require authentication

✅ **Complete Workflow**
- Create property → Browse properties → Request booking → Receive/Handle requests → Chat

✅ **Real-time Chat**
- Messages auto-load and display
- Read status tracking
- Unread count notifications

✅ **Status Tracking**
- Bookings have clear status: pending → accepted/rejected → completed/cancelled
- Color-coded status badges

✅ **Secure**
- All booking and messaging endpoints require JWT authentication
- Authorization checks ensure users only see their own bookings/messages

## Environment Setup

### Frontend (Port 8080)
```bash
npm run dev
```

### Backend (Port 5000)
```bash
cd backend
node src/server.js
```

### Database
- MongoDB Atlas connected
- Collections: Users, Properties, Bookings, Messages

### Image Storage
- ImageKit CDN for property images

## Testing the System

1. **Create Account**
   - Sign up with email on /auth page

2. **Create Property**
   - Go to "List Your Property"
   - Fill in property details and upload images
   - Publish property

3. **Browse Properties**
   - View created property in /properties listing
   - Click to view details

4. **Book Property (with different account)**
   - Sign in with different account
   - View another user's property
   - Click "Book Now"
   - Fill booking details
   - Submit booking request

5. **Accept Booking (original account)**
   - Sign back in as property owner
   - Go to "Booking Requests"
   - View the pending booking
   - Click "Accept" to approve

6. **Chat**
   - Both users now see the booking in "Messages"
   - Click to open conversation
   - Send messages back and forth

## Known Limitations & Future Improvements

- [ ] Payment integration (currently manual)
- [ ] Automated email notifications for bookings
- [ ] Review/rating system
- [ ] Calendar view for bookings
- [ ] Booking cancellation with refund logic
- [ ] Guest list management
- [ ] Advance booking features (recurring bookings, etc.)

## Error Handling

All pages include:
- Loading states during API calls
- Error alerts for failed operations
- Toast notifications for successful actions
- User-friendly error messages

## Performance Considerations

- Messages auto-marked as read when viewed
- Unread count tracked for notifications
- Lazy loading of conversations
- Indexed database queries for fast lookups
