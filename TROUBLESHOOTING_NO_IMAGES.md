# 🔧 Troubleshooting - Why No Images Are Showing

## Issue
Console shows errors like:
```
400x300?text=Property+Name:1  Failed to load resource: net::ERR_NAME_NOT_RESOLVED
```

## Root Cause
**The assignment script has NOT been run yet!**

Properties in the database don't have images assigned. The code is working correctly - it's just showing "No images available" using old fallback URLs from somewhere.

---

## ✅ Solution (3 Steps)

### Step 1: Start MongoDB
```bash
mongod
```
Wait for: `waiting for connections on port 27017`

### Step 2: Run Assignment Script
```bash
cd c:\Users\Navadeep\OneDrive\Desktop\webgi-main\backend
node scripts/assignLocalImages.js
```

**Expected Output**:
```
✅ Connected to MongoDB
📦 Found X properties
🎲 Shuffled 22 images
✓ Property "Name 1" updated with 3 images
✓ Property "Name 2" updated with 3 images
...
✅ Successfully assigned images to X properties!
```

### Step 3: Clear Browser Cache
```
Press: Ctrl + Shift + R  (Hard refresh)
OR
Press: F12 → Right-click reload button → Empty cache and hard refresh
```

### Step 4: Restart Dev Servers
Kill and restart:
- Frontend: `npm run dev`
- Backend: `cd backend && npm run dev`

---

## Verify It Worked

1. Check console for errors
   - Should see NO `via.placeholder.com` errors
   - Should see NO `400x300?text=` errors

2. Check database
   ```
   mongosh
   use webgi_db
   db.properties.findOne()
   # Should show images array with 3 items
   ```

3. Check images displaying
   - Go to http://localhost:5173/properties
   - Should see real samplehstl*.avif images
   - OR "No Preview" message (professional)

---

## If Still Not Working

### Issue: Script says "No properties found"
**Solution**: Create test properties first or check database connection

### Issue: Images still not showing
**Solution**: 
1. Hard refresh again (Ctrl+Shift+R)
2. Clear browser cache completely
3. Check DevTools → Network tab → see if images load

### Issue: Still seeing `via.placeholder.com` errors
**Solution**:
1. Database might not have updated
2. Run script again
3. Verify each property has images array in MongoDB

---

## Quick Diagnostic Commands

### Check MongoDB Connection
```bash
mongosh
db.version()  # Should show version
```

### Check Properties Count
```bash
mongosh
use webgi_db
db.properties.countDocuments()
```

### Check If Property Has Images
```bash
mongosh
use webgi_db
db.properties.findOne({}, {images: 1, title: 1})
# Look for "images" array with URL objects
```

### Check Script Output
```bash
cd backend
node scripts/assignLocalImages.js 2>&1 | tee assignment_output.log
# Check assignment_output.log for any errors
```

---

## Expected Success State

✅ **What you should see after running script**:

**In Console**:
- No red errors
- No `via.placeholder.com` errors
- No `ERR_NAME_NOT_RESOLVED`

**On Properties Page**:
- Images from `/public/samplehstl*.avif`
- OR professional "No Preview Available" message
- No broken image icons

**In MongoDB**:
```javascript
{
  title: "Property Name",
  images: [
    { url: "/samplehstl1.avif", uploadedAt: Date, fileId: "..." },
    { url: "/samplehstl5.avif", uploadedAt: Date, fileId: "..." },
    { url: "/samplehstl12.avif", uploadedAt: Date, fileId: "..." }
  ]
}
```

---

## Step-by-Step Recovery

1. **Stop everything**
   - Kill all terminals (Ctrl+C)

2. **Start MongoDB**
   ```bash
   mongod
   ```

3. **Run assignment (NEW TERMINAL)**
   ```bash
   cd backend
   node scripts/assignLocalImages.js
   ```
   - Wait for success message
   - Note the count of properties updated

4. **Start servers (NEW TERMINALS)**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd backend && npm run dev
   ```

5. **Hard refresh browser**
   ```
   Ctrl+Shift+R
   ```

6. **Verify**
   - Check console (F12)
   - Check properties page
   - Check MongoDB

---

## Favicon Warning (Minor)

The `favicon.ico 404` error is minor - can fix with:

```bash
# Create empty favicon
touch public/favicon.ico
```

Or add to `index.html`:
```html
<link rel="icon" href="/favicon.svg" />
```

---

## If Everything Fails

**Nuclear Option** (Reset & Rebuild):

```bash
# Clean everything
rm -r node_modules package-lock.json
npm install

# Rebuild
npm run build

# Clear browser cache completely
# Close ALL browsers
# Press Ctrl+Shift+Delete in browser → Clear all

# Start over
mongod  # Terminal 1
cd backend && node scripts/assignLocalImages.js  # Terminal 2
npm run dev  # Terminal 3
cd backend && npm run dev  # Terminal 4
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `via.placeholder.com` errors | Run assignment script |
| "No properties found" | Check MongoDB running |
| Images still not showing | Hard refresh (Ctrl+Shift+R) |
| Same errors after refresh | Clear browser cache, restart servers |
| `ERR_NAME_NOT_RESOLVED` | Database doesn't have images, run script |

---

## Success Indicators ✅

When it's working you'll see:
- ✅ Real images (samplehstl*.avif)
- ✅ NO placeholder URLs
- ✅ NO via.placeholder.com
- ✅ NO ERR_NAME_NOT_RESOLVED
- ✅ NO 400x300 text errors
- ✅ Professional "No Preview" if no images

---

**Current Status**: Images not in database yet
**Next Action**: Run assignment script
**Time to Fix**: 5 minutes

👉 **Run this now:**
```bash
# Terminal 1
mongod

# Terminal 2 (in backend folder)
node scripts/assignLocalImages.js

# Then hard refresh browser: Ctrl+Shift+R
```
