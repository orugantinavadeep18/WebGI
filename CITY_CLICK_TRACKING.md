# City Click Tracking System - User Guide

## Overview

The city click tracking system automatically tracks and records every time a user clicks on a city to view properties. This data is stored in MongoDB and can be exported to CSV format for analytics and reporting.

## Features

✅ **Automatic Click Tracking** - Every city click is logged with timestamp, user info, and IP address
✅ **MongoDB Storage** - All clicks are stored in a dedicated `CityClick` collection
✅ **CSV Export** - Download click data as CSV for spreadsheet analysis
✅ **Analytics API** - Query city click statistics with date range filtering
✅ **Anonymous Tracking** - Tracks both registered users and anonymous visitors

## How It Works

### 1. **When a User Clicks a City**

City clicks are tracked from:
- **PopularCities Component** - Home page city cards
- **Header Navigation** - Top navigation city buttons
- **Mobile Menu** - City options in mobile menu

Each click sends data to: `POST /api/rentals/track-city-click`

### 2. **Data Captured**

```json
{
  "city": "Bangalore",
  "userId": "user_id_or_null",
  "userEmail": "user@example.com",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-30T10:30:45.123Z"
}
```

### 3. **API Endpoints**

#### Track a City Click
```
POST /api/rentals/track-city-click
Content-Type: application/json

{
  "city": "Mumbai"
}
```

**Response:**
```json
{
  "message": "City click tracked successfully",
  "cityClick": {
    "_id": "...",
    "city": "Mumbai",
    "userId": null,
    "userEmail": null,
    "timestamp": "2024-01-30T10:30:45.123Z"
  }
}
```

#### Get City Click Statistics
```
GET /api/rentals/city-click-stats?startDate=2024-01-01&endDate=2024-01-31&limit=10
```

**Response:**
```json
{
  "message": "City click statistics retrieved",
  "stats": [
    {
      "city": "Bangalore",
      "clicks": 150
    },
    {
      "city": "Mumbai",
      "clicks": 120
    }
  ],
  "total": 270
}
```

#### Export City Clicks to CSV
```
GET /api/rentals/export-city-clicks?startDate=2024-01-01&endDate=2024-01-31
```

**Response:** Downloads a CSV file with columns:
- City
- User Email
- IP Address
- Timestamp

## Usage Examples

### 1. **View Most Popular Cities**

```javascript
// Frontend code to fetch statistics
const response = await fetch(
  'http://localhost:5000/api/rentals/city-click-stats?limit=5'
);
const data = await response.json();
console.log(data.stats); // Top 5 cities by clicks
```

### 2. **Export Last 30 Days of City Clicks**

```javascript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const params = new URLSearchParams({
  startDate: thirtyDaysAgo.toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
});

const link = document.createElement('a');
link.href = `http://localhost:5000/api/rentals/export-city-clicks?${params}`;
link.download = 'city-clicks.csv';
link.click();
```

### 3. **Track City Click Manually**

```javascript
const handleCityClick = async (cityName) => {
  try {
    await fetch('/api/rentals/track-city-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: cityName })
    });
  } catch (error) {
    console.error('Failed to track click:', error);
  }
};
```

## Database Schema

### CityClick Collection

```javascript
{
  _id: ObjectId,
  city: String,              // Required, indexed
  userId: ObjectId,          // Reference to User (nullable)
  userEmail: String,         // Email for reference (nullable)
  ipAddress: String,         // IP address (nullable)
  userAgent: String,         // Browser/device info (nullable)
  createdAt: Date,          // Timestamp (indexed)
  updatedAt: Date,          // Last updated
  timestamp: Date           // Initial click time (indexed)
}
```

**Indexes:**
- `city: 1, createdAt: -1` - For efficient city filtering by date
- `createdAt: -1` - For time-based queries

## Components Updated

### 1. **PopularCities Component**
- Added `handleCityClick()` function
- Tracks clicks when city cards are clicked
- File: `src/components/home/PopularCities.jsx`

### 2. **Header Navigation**
- Added `trackCityClick()` function
- Tracks clicks from top navigation and mobile menu
- File: `src/components/layout/Header.jsx`

### 3. **Backend Controllers**
- Added `trackCityClick()` - Records click in database
- Added `getCityClickStats()` - Retrieves statistics
- Added `exportCityClicksCSV()` - Exports to CSV
- File: `backend/src/controllers/rentalController.js`

### 4. **New Model**
- Created `CityClick` model for storing click data
- File: `backend/src/models/CityClick.js`

## Analytics Dashboard (Future Enhancement)

You can create a dashboard page to visualize city click data:

```javascript
// Example dashboard component
const CityAnalytics = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/rentals/city-click-stats?limit=10');
      const data = await response.json();
      setStats(data.stats);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>City Click Analytics</h1>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(stat => (
            <tr key={stat.city}>
              <td>{stat.city}</td>
              <td>{stat.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Troubleshooting

### Clicks not being tracked?

1. **Check console logs** - Look for "📊 Tracking city click" messages
2. **Verify API endpoint** - Ensure `/api/rentals/track-city-click` is accessible
3. **Check backend logs** - Look for "✅ Tracked city click" messages
4. **Verify MongoDB connection** - Ensure database is running

### CSV export returns empty?

1. **Check date range** - Ensure startDate is before endDate
2. **Verify clicks exist** - Use `/api/rentals/city-click-stats` to check if data exists
3. **Check timezone** - API uses ISO format (UTC)

## Performance Considerations

- **Click tracking is non-blocking** - Doesn't interfere with navigation
- **Database indices** - Optimized for fast queries
- **CSV export limit** - Limited to 100,000 records for safety
- **Caching** - Consider caching statistics for high-traffic sites

## Security Notes

- City click data includes IP addresses and user agents
- Anonymous clicks have `userId: null`
- Data is stored in MongoDB with proper access controls
- CSV export should be authenticated in production

## Future Enhancements

- [ ] Real-time analytics dashboard
- [ ] Heat map visualization of popular cities
- [ ] Trend analysis and forecasting
- [ ] User behavior segmentation
- [ ] Geographic distribution analysis
