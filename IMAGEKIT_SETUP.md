# ImageKit Setup - Complete Guide

## ✅ What's Been Done

```
✓ Firebase removed from backend
✓ ImageKit SDK installed (imagekit package)
✓ ImageKit configuration created
✓ Backend updated to use ImageKit
✓ Environment variables prepared
✓ Ready for your ImageKit credentials
```

---

## 🔑 Step 1: Get ImageKit Account & Credentials

### 1.1 Create ImageKit Account
1. Go to https://imagekit.io (sign up free)
2. Click "Sign Up Free"
3. Fill in your details
4. Verify email
5. You now have a free account!

### 1.2 Get Your Credentials
1. Login to ImageKit Dashboard
2. Go to **Settings** → **Developer** (left sidebar)
3. You'll see:
   - **Public Key** - Copy this
   - **Private Key** - Copy this
   - **URL Endpoint** - Copy this (format: https://ik.imagekit.io/xxxxx)

### 1.3 Example Credentials
```
Public Key: public_abc123def456
Private Key: private_xyz789uvm...
URL Endpoint: https://ik.imagekit.io/myproject
```

---

## 📝 Step 2: Add Credentials to backend/.env

Open `backend/.env` and update:

```env
# ImageKit Configuration (for image storage)
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

**Example:**
```env
IMAGEKIT_PUBLIC_KEY=public_abc123def456
IMAGEKIT_PRIVATE_KEY=private_xyz789uvwxyz123456
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/myproject
```

---

## 🚀 Step 3: How It Works

### Image Upload Flow:

```
┌──────────────────────┐
│  Frontend: User      │
│  selects images      │
└────────────┬─────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Backend API receives files          │
│  POST /api/properties/:id/upload     │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  ImageKit Configuration Loads        │
│  (from .env variables)               │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Backend uploads to ImageKit         │
│  imagekit.upload({                   │
│    file: buffer,                     │
│    folder: /properties/{id}/         │
│  })                                  │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  ImageKit returns:                   │
│  - URL (for displaying image)        │
│  - fileId (for deleting image)       │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Backend saves to MongoDB:           │
│  property.images = [{                │
│    url: "https://ik.imagekit.io/...", │
│    fileId: "abc123...",              │
│    name: "image.jpg",                │
│    uploadedAt: Date                  │
│  }]                                  │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Frontend receives response          │
│  Displays images from MongoDB URLs   │
└──────────────────────────────────────┘
```

---

## 💡 ImageKit Features

### Free Tier Includes:
```
✓ 20 GB bandwidth/month
✓ Unlimited images storage
✓ Image optimization & transformation
✓ Automatic format conversion
✓ CDN global delivery
✓ Real-time image transformations
✓ API for uploads & deletes
```

### Pricing:
```
Free: $0/month (20GB bandwidth)
Pay As You Go: $0.25 per additional GB
```

---

## 🔧 Configuration File

**File: `backend/src/config/imagekit.js`**

```javascript
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
```

This file loads your credentials from `.env` and creates an ImageKit instance.

---

## 📤 Upload Endpoint (Already Configured)

**File: `backend/src/controllers/propertyController.js`**

The `uploadPropertyImages` function:

```javascript
export const uploadPropertyImages = async (req, res) => {
  // 1. Validates property exists
  // 2. Checks user is seller
  // 3. For each file:
  //    - Uploads to ImageKit
  //    - Gets URL and fileId
  //    - Saves to MongoDB
  // 4. Returns updated property
}
```

---

## 🎨 Image URL Features

ImageKit URLs support real-time transformations:

```
Original URL:
https://ik.imagekit.io/myproject/properties/123/image.jpg

Resize to 300x300:
https://ik.imagekit.io/myproject/tr:w-300,h-300/properties/123/image.jpg

Crop to square:
https://ik.imagekit.io/myproject/tr:w-500,h-500,c-at_max/properties/123/image.jpg

Change quality:
https://ik.imagekit.io/myproject/tr:q-80/properties/123/image.jpg

Combine transformations:
https://ik.imagekit.io/myproject/tr:w-300,h-300,q-80/properties/123/image.jpg
```

---

## ✅ Testing ImageKit Setup

### Step 1: Add Your Credentials
```
Edit backend/.env:
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
```

### Step 2: Start Backend
```bash
cd backend
npm run dev
```

### Step 3: Start Frontend
```bash
npm run dev
```

### Step 4: Test Upload
1. Go to http://localhost:5173
2. Register as seller
3. Create property
4. Upload images
5. See images appear on page

### Step 5: Verify
```
Check 1: MongoDB
  → Property has images array
  → URLs are from ImageKit (ik.imagekit.io)

Check 2: ImageKit Console
  → Go to Media Library
  → See properties folder
  → See uploaded images

Check 3: Frontend
  → Images display correctly
  → Images load fast (CDN cached)
```

---

## 📊 MongoDB Storage Structure

Images are saved as:

```javascript
property.images = [
  {
    url: "https://ik.imagekit.io/myproject/properties/abc123/file.jpg",
    fileId: "abc123xyz789",
    name: "file.jpg",
    uploadedAt: "2026-01-27T10:30:45.123Z"
  },
  {
    url: "https://ik.imagekit.io/myproject/properties/abc123/photo.jpg",
    fileId: "xyz789abc123",
    name: "photo.jpg",
    uploadedAt: "2026-01-27T10:31:12.456Z"
  }
]
```

---

## 🗑️ Delete Images

When deleting property, images are removed from ImageKit using `fileId`:

```javascript
// Automatic when deleting property
await imagekit.deleteFile(image.fileId);
```

---

## 🔒 Security

Your ImageKit setup is secure because:

```
✅ Private Key only on backend (not exposed)
✅ Upload validation (seller only)
✅ User authentication required (JWT token)
✅ Images organized by property ID
✅ Only property owner can upload
✅ Can delete images via fileId
```

---

## 📚 ImageKit Features You Can Use

### Display Images in Different Sizes:
```jsx
// Original
<img src="https://ik.imagekit.io/xxx/image.jpg" />

// Thumbnail (300x300)
<img src="https://ik.imagekit.io/xxx/tr:w-300,h-300/image.jpg" />

// For thumbnails in list
<img src="https://ik.imagekit.io/xxx/tr:w-150,h-150,c-at_max/image.jpg" />

// For full view
<img src="https://ik.imagekit.io/xxx/tr:w-800/image.jpg" />
```

### Optimization:
```jsx
// Auto-optimize quality
<img src="https://ik.imagekit.io/xxx/tr:q-auto/image.jpg" />

// Progressive JPEG
<img src="https://ik.imagekit.io/xxx/tr:f-auto/image.jpg" />
```

---

## 🎯 Next Steps

1. **Get ImageKit Account**
   - https://imagekit.io
   - Sign up free (takes 2 minutes)

2. **Get Your Credentials**
   - Go to Settings → Developer
   - Copy Public Key, Private Key, URL Endpoint

3. **Update backend/.env**
   - Add your 3 credentials

4. **Test Upload**
   - Start backend
   - Start frontend
   - Upload images
   - Verify in ImageKit console

5. **Build Features**
   - Image gallery
   - Thumbnail display
   - Image optimization
   - Image transformations

---

## 🆘 Troubleshooting

### Issue: "Invalid credentials"
**Solution:**
- Check credentials are copied correctly
- No extra spaces
- Restart backend server

### Issue: "Upload fails silently"
**Solution:**
- Check backend console for errors
- Verify ImageKit credentials are set
- Check property exists
- Check user is logged in as seller

### Issue: "Images don't appear"
**Solution:**
- Check MongoDB has image URLs
- Verify URLs are from ImageKit domain
- Try refreshing browser
- Check browser console for errors

### Issue: "ImageKit API error"
**Solution:**
- Go to ImageKit dashboard
- Check API usage
- Verify credentials have permission
- Check account is active

---

## 💰 ImageKit Pricing

Free: 20GB bandwidth/month
Pay as you go: $0.25/GB after that

**For your real estate app:**
- 100 properties × 5 images = 500 images
- Average 200KB per image = 100GB
- That's 5 months of free tier!

---

## 🚀 ImageKit vs Firebase

| Feature | ImageKit | Firebase |
|---------|----------|----------|
| Setup | 2 minutes | 10 minutes |
| Free Tier | 20GB/month | 5GB/month |
| Speed | CDN global | CDN global |
| URL Size | Small | Large |
| API Simplicity | Very simple | Moderate |
| Image Transform | Built-in | Requires add-on |
| Support | Good | Excellent |

**ImageKit is faster to set up and has better free tier! ✓**

---

## 📝 Summary

### What's Ready:
```
✓ Backend configured for ImageKit
✓ Upload endpoint ready
✓ Delete endpoint ready
✓ MongoDB integration ready
✓ Environment variables prepared
```

### What You Need to Do:
```
1. Create ImageKit account (free)
2. Get 3 credentials
3. Add to backend/.env
4. Test upload
```

### Time to Production:
```
5 minutes with ImageKit setup
Perfect! 🚀
```

---

## ✨ You're All Set!

ImageKit is ready to go. Just get your free account and add the credentials!

No Firebase, no complications, just simple image storage with ImageKit. 🎉

