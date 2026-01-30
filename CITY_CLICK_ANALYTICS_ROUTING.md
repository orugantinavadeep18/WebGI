# Adding City Click Analytics to Your App Routes

## Step 1: Import the Component

In your main routing file (likely `src/App.jsx`), add:

```javascript
import CityClickAnalytics from "@/pages/CityClickAnalytics";
```

## Step 2: Add Route

Add this route to your route configuration:

```javascript
// Admin/Analytics routes
<Route path="/admin/city-analytics" element={<CityClickAnalytics />} />
```

## Example Full Route Setup

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import CityClickAnalytics from "@/pages/CityClickAnalytics";
import Login from "@/pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin routes */}
        <Route path="/admin/city-analytics" element={<CityClickAnalytics />} />
        
        {/* Add your other routes here */}
      </Routes>
    </BrowserRouter>
  );
}
```

## Step 3: Add Navigation Link

Add a link to the analytics page in your admin panel or header:

```javascript
// In admin menu or sidebar
<Link to="/admin/city-analytics" className="menu-item">
  📊 City Analytics
</Link>
```

Or in a button:

```javascript
<Button onClick={() => navigate("/admin/city-analytics")}>
  View City Analytics
</Button>
```

## Step 4: Protect the Route (Optional)

If you want to restrict access to admin only:

```javascript
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ element, requiredRole }) {
  const { user } = useAuth();
  
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }
  
  return element;
}

// In your routes
<Route
  path="/admin/city-analytics"
  element={<ProtectedRoute element={<CityClickAnalytics />} requiredRole="admin" />}
/>
```

## Step 5: Test the Integration

1. **Start your app**: `npm run dev`
2. **Navigate to**: `http://localhost:5173/admin/city-analytics`
3. **Click some cities** on the home page
4. **Refresh the analytics page** - you should see the data
5. **Try exporting** - click the "Export CSV" button

## Adding to Admin Dashboard

If you have an admin dashboard, you can embed the analytics like this:

```javascript
// In your admin dashboard
import CityClickAnalytics from "@/pages/CityClickAnalytics";

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="admin-grid">
        <CityClickAnalytics />
      </div>
    </Layout>
  );
}
```

## Quick Link Component

Add this to your navigation for quick access:

```javascript
const AdminMenu = () => {
  return (
    <div className="admin-menu">
      <Link to="/admin/city-analytics">
        <div className="menu-card">
          <h3>City Analytics</h3>
          <p>Track and analyze city clicks</p>
          <span>→</span>
        </div>
      </Link>
    </div>
  );
};
```

## Environment Variables (if needed)

Make sure your `.env` has:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Verification Checklist

After integration, verify:

- [ ] Route `/admin/city-analytics` is accessible
- [ ] Page loads without errors
- [ ] Analytics data displays correctly
- [ ] CSV export button works
- [ ] Date filter works
- [ ] Statistics update after clicking cities

## Customization

### Change the Route Path

```javascript
// Instead of /admin/city-analytics
<Route path="/analytics/cities" element={<CityClickAnalytics />} />
```

### Add to Specific Layout

```javascript
<Route
  path="/admin/city-analytics"
  element={
    <AdminLayout>
      <CityClickAnalytics />
    </AdminLayout>
  }
/>
```

### Combine Multiple Analytics

```javascript
import CityClickAnalytics from "@/pages/CityClickAnalytics";
import UserAnalytics from "@/pages/UserAnalytics";
import PropertyAnalytics from "@/pages/PropertyAnalytics";

export default function AnalyticsHub() {
  const [activeTab, setActiveTab] = useState("cities");

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cities">
          <CityClickAnalytics />
        </TabsContent>
        <TabsContent value="users">
          <UserAnalytics />
        </TabsContent>
        <TabsContent value="properties">
          <PropertyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Common Issues

### Analytics page not loading?
- Check if route is added to your router
- Verify `CityClickAnalytics` component import path
- Check browser console for errors

### Data not showing?
- Click some cities first
- Refresh the page
- Check if backend is running
- Verify MongoDB connection

### Export not working?
- Check if backend API endpoint is accessible
- Verify date range is valid
- Check network tab in DevTools for errors

## API Testing

Test the endpoints directly in terminal:

```bash
# Get stats
curl http://localhost:5000/api/rentals/city-click-stats

# Export CSV
curl http://localhost:5000/api/rentals/export-city-clicks \
  -o city-clicks.csv

# Check stats with date filter
curl "http://localhost:5000/api/rentals/city-click-stats?startDate=2024-01-01&endDate=2024-01-31"
```

## Next Steps

1. ✅ Add route to your app
2. ✅ Test the page loads
3. ✅ Click some cities
4. ✅ Export data to CSV
5. ✅ Customize styling as needed
6. [ ] Add to admin dashboard
7. [ ] Create additional analytics pages
8. [ ] Set up automated reports

---

That's it! Your city click analytics are now integrated and ready to use.
