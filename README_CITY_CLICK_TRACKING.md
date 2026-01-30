# 🎯 City Click Tracking System - Complete Guide

## Overview

A production-ready city click tracking system that automatically records when users click on cities, stores the data in MongoDB, and allows you to export analytics to CSV format.

## 🚀 Quick Start

### What You Get

✅ Automatic click tracking from multiple components  
✅ MongoDB data storage with indexed queries  
✅ RESTful API for statistics and exports  
✅ CSV export functionality  
✅ Analytics dashboard component  
✅ No impact on user experience  

### In 3 Steps

1. **Backend is ready** - Just ensure MongoDB is running
2. **Frontend integrated** - Click tracking is active on city cards and headers
3. **Test it** - Click any city and check `/api/rentals/city-click-stats`

## 📁 File Structure

```
WebGI/
├── backend/
│   └── src/
│       ├── models/
│       │   └── CityClick.js                    ← NEW: Click model
│       ├── controllers/
│       │   └── rentalController.js             ← Updated: 3 new functions
│       └── routes/
│           └── rentals.js                      ← Updated: 3 new endpoints
│
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   └── PopularCities.jsx              ← Updated: Click tracking
│   │   └── layout/
│   │       └── Header.jsx                      ← Updated: Click tracking
│   └── pages/
│       └── CityClickAnalytics.jsx             ← NEW: Analytics dashboard
│
└── Documentation/
    ├── CITY_CLICK_TRACKING.md                 ← Complete guide
    ├── CITY_CLICK_TRACKING_SETUP.md           ← Setup instructions
    ├── CITY_CLICK_TRACKING_SUMMARY.md         ← Implementation summary
    └── CITY_CLICK_ANALYTICS_ROUTING.md        ← Routing instructions
```

## 🔌 API Endpoints

### 1. Track City Click
```
POST /api/rentals/track-city-click
Content-Type: application/json

{
  "city": "Bangalore"
}
```

**Response:** Click record created  
**Use:** Called automatically when user clicks a city

### 2. Get City Click Statistics
```
GET /api/rentals/city-click-stats
?startDate=2024-01-01
&endDate=2024-01-31
&limit=10
```

**Response:**
```json
{
  "stats": [
    { "city": "Bangalore", "clicks": 150 },
    { "city": "Mumbai", "clicks": 120 }
  ],
  "total": 270
}
```

### 3. Export to CSV
```
GET /api/rentals/export-city-clicks
?startDate=2024-01-01
&endDate=2024-01-31
```

**Response:** CSV file download  
**Format:** City, User Email, IP Address, Timestamp

## 📊 Database Schema

### CityClick Collection
```javascript
{
  _id: ObjectId,
  city: String,              // City name (indexed)
  userId: ObjectId | null,   // User ID or null
  userEmail: String | null,  // User email or null
  ipAddress: String | null,  // Visitor IP
  userAgent: String | null,  // Browser info
  timestamp: Date,           // Click time (indexed)
  createdAt: Date,          // Record creation
  updatedAt: Date           // Last update
}
```

### Indexes
- `city: 1, createdAt: -1` - Fast city + date queries
- `createdAt: -1` - Fast date range queries

## 🎨 Components

### PopularCities.jsx
- Tracks clicks from home page city cards
- Shows property count per city
- Non-blocking async tracking

### Header.jsx
- Tracks clicks from top navigation
- Tracks clicks from mobile menu
- Works with city filtering

### CityClickAnalytics.jsx
- Displays click statistics
- Date range filtering
- CSV export button
- Visual bar charts
- Percentage distribution

## 📈 Usage Examples

### Get Top 5 Cities
```javascript
const response = await fetch(
  'http://localhost:5000/api/rentals/city-click-stats?limit=5'
);
const data = await response.json();
console.log(data.stats);
// [{ city: "Bangalore", clicks: 150 }, ...]
```

### Export Last 30 Days
```javascript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const link = document.createElement('a');
link.href = `http://localhost:5000/api/rentals/export-city-clicks?startDate=${thirtyDaysAgo.toISOString().split('T')[0]}`;
link.download = 'city-clicks.csv';
link.click();
```

### Display in Dashboard
```javascript
const [stats, setStats] = useState([]);

useEffect(() => {
  fetch('/api/rentals/city-click-stats?limit=10')
    .then(r => r.json())
    .then(data => setStats(data.stats));
}, []);

return (
  <table>
    <tbody>
      {stats.map(stat => (
        <tr key={stat.city}>
          <td>{stat.city}</td>
          <td>{stat.clicks}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

## 🔒 Security

- Tracks IP addresses (compliant with privacy terms)
- Separates anonymous and authenticated users
- Can be extended with role-based access
- Data stored securely in MongoDB

## ⚡ Performance

- **Non-blocking** - Click tracking doesn't affect UX
- **Indexed queries** - Fast database lookups
- **Efficient aggregation** - MongoDB pipelines
- **Capped exports** - Limits to 100K records for safety

## 🧪 Testing

### Test 1: Click Tracking
```javascript
// In browser console
// Click a city and you should see:
// "📊 Tracking city click: Bangalore"
// "✅ City click tracked: {...}"
```

### Test 2: API Response
```bash
curl http://localhost:5000/api/rentals/city-click-stats
# Should return JSON with city data
```

### Test 3: CSV Export
```bash
curl http://localhost:5000/api/rentals/export-city-clicks \
  -o test.csv
# Should download a CSV file with click records
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [CITY_CLICK_TRACKING.md](./CITY_CLICK_TRACKING.md) | Complete feature guide |
| [CITY_CLICK_TRACKING_SETUP.md](./CITY_CLICK_TRACKING_SETUP.md) | Setup & testing |
| [CITY_CLICK_TRACKING_SUMMARY.md](./CITY_CLICK_TRACKING_SUMMARY.md) | Implementation details |
| [CITY_CLICK_ANALYTICS_ROUTING.md](./CITY_CLICK_ANALYTICS_ROUTING.md) | Adding routes to app |

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Clicks not tracked | Check browser console for errors |
| Empty statistics | Verify clicks occurred in date range |
| CSV is empty | Use API endpoint to verify data exists |
| 404 on API | Check route is added to server.js |
| MongoDB error | Ensure MONGO_URI env var is set |

## 🚀 Next Steps

### Immediate
- [ ] Start backend: `npm start`
- [ ] Click cities on frontend
- [ ] Check stats API
- [ ] Export to CSV

### Short Term
- [ ] Add route to app: `/admin/city-analytics`
- [ ] Integrate into admin dashboard
- [ ] Add to navigation menu

### Long Term
- [ ] Real-time dashboards
- [ ] Scheduled CSV exports
- [ ] Trend analysis
- [ ] Predictive analytics
- [ ] Heat maps by location

## 📝 Code Examples

### Add to Admin Panel
```javascript
import CityClickAnalytics from "@/pages/CityClickAnalytics";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <CityClickAnalytics />
    </div>
  );
}
```

### Create Custom Chart
```javascript
const [stats, setStats] = useState([]);

useEffect(() => {
  fetch('/api/rentals/city-click-stats?limit=10')
    .then(r => r.json())
    .then(data => setStats(data.stats));
}, []);

return (
  <BarChart data={stats} />
);
```

### Download with Date Filter
```javascript
const handleExport = async (startDate, endDate) => {
  const url = `/api/rentals/export-city-clicks?startDate=${startDate}&endDate=${endDate}`;
  window.location.href = url;
};
```

## 🎓 What You Learned

✅ Implemented analytics tracking system  
✅ Worked with MongoDB aggregation pipelines  
✅ Created RESTful CSV export API  
✅ Integrated tracking into React components  
✅ Built analytics dashboard UI  
✅ Used async/await for API calls  

## 📞 Support

Having issues? Check:
1. Browser console for client-side errors
2. Backend server logs for API errors
3. MongoDB connection string in `.env`
4. API endpoint response with `curl`

## 📄 License

This tracking system is part of the WebGI project.

---

## Summary

You now have a **production-ready city click tracking system** that:
- Automatically tracks city clicks
- Stores data in MongoDB
- Provides statistics API
- Exports to CSV format
- Includes analytics dashboard

**Status:** ✅ Ready to Use

Start tracking city clicks now! 🎯
