# City Click Tracking - Quick Setup Guide

## What Was Added

A complete city click tracking system that automatically records when users click on cities. The data is stored in MongoDB and can be exported to CSV.

## Files Changed

### Backend
1. **Created:** `backend/src/models/CityClick.js` - MongoDB model
2. **Updated:** `backend/src/controllers/rentalController.js` - Added 3 new functions
3. **Updated:** `backend/src/routes/rentals.js` - Added 3 new API endpoints

### Frontend
1. **Updated:** `src/components/home/PopularCities.jsx` - Added click tracking
2. **Updated:** `src/components/layout/Header.jsx` - Added click tracking for navigation

## Installation Steps

### 1. Backend Setup

The model is already created. Just ensure your MongoDB is running:

```bash
cd backend
npm install  # If needed
npm start
```

### 2. Testing the System

#### Test 1: Click a City
Visit your app and click on any city. Check browser console for:
```
📊 Tracking city click: Bangalore
✅ City click tracked: ...
```

#### Test 2: Get Statistics
```bash
curl http://localhost:5000/api/rentals/city-click-stats
```

Response:
```json
{
  "message": "City click statistics retrieved",
  "stats": [
    {
      "city": "Bangalore",
      "clicks": 5
    }
  ],
  "total": 5
}
```

#### Test 3: Export to CSV
```bash
curl http://localhost:5000/api/rentals/export-city-clicks \
  -o city-clicks.csv
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rentals/track-city-click` | Track a city click |
| `GET` | `/api/rentals/city-click-stats` | Get click statistics |
| `GET` | `/api/rentals/export-city-clicks` | Export clicks as CSV |

## Query Parameters

### city-click-stats
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `limit` - Max results (default: 10)

### export-city-clicks
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)

## Example Requests

### Get stats for last 7 days
```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

fetch(`/api/rentals/city-click-stats?startDate=${sevenDaysAgo.toISOString().split('T')[0]}`)
  .then(r => r.json())
  .then(data => console.log(data.stats));
```

### Export last 30 days
```javascript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const url = `/api/rentals/export-city-clicks?startDate=${thirtyDaysAgo.toISOString().split('T')[0]}`;
window.location.href = url;
```

## CSV File Format

When you export, you get a file with:

```
City,User Email,IP Address,Timestamp
"Bangalore","user@example.com","192.168.1.1","2024-01-30T10:30:45.123Z"
"Mumbai","Anonymous","192.168.1.2","2024-01-30T10:31:20.456Z"
"Delhi",null,"192.168.1.3","2024-01-30T10:32:10.789Z"
```

## Database Records

Each click creates a record like:

```javascript
{
  _id: ObjectId("..."),
  city: "Bangalore",
  userId: null,                    // null for anonymous users
  userEmail: "user@example.com",   // null if not logged in
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  timestamp: "2024-01-30T10:30:45.123Z",
  createdAt: "2024-01-30T10:30:45.123Z",
  updatedAt: "2024-01-30T10:30:45.123Z"
}
```

## Verification

### 1. Check Console Logs
Open browser DevTools → Console and click a city. You should see:
```
📊 Tracking city click: Bangalore
✅ City click tracked: {...}
```

### 2. Check Server Logs
Look for backend logs showing:
```
✅ Tracked city click: Bangalore at 2024-01-30T10:30:45.123Z
```

### 3. Check MongoDB
```bash
# Connect to MongoDB and run:
db.cityclicks.find().pretty()
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Clicks not showing in console | Check if `/api/rentals/track-city-click` endpoint is working |
| Empty CSV export | Verify clicks exist using `/api/rentals/city-click-stats` |
| MongoDB connection error | Ensure MongoDB is running and `MONGO_URI` is correct |
| 404 on API endpoints | Verify routes are correctly imported in `backend/src/server.js` |

## Next Steps

1. **Create Admin Dashboard** - Display city click statistics
2. **Add Filtering** - Filter by date range, user, etc.
3. **Add Charts** - Visualize city popularity trends
4. **Set Up Notifications** - Alert when a city reaches a threshold
5. **Auto-Export** - Schedule daily/weekly CSV exports

## Support

For detailed documentation, see:
- [CITY_CLICK_TRACKING.md](./CITY_CLICK_TRACKING.md) - Complete guide
- API logs in browser console
- Backend server logs

---

**System Status:** ✅ Ready to use

Click any city to start tracking!
