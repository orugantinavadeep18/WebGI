# Admin Login - Fixed ✅

## What Was Fixed

### Problem:
- Admin login was failing because the app was using Supabase authentication
- But the admin credentials were stored in MongoDB backend
- Admin dashboard showed 0 users

### Solution:
1. **Switched from Supabase to Backend JWT Authentication**
   - Updated `src/hooks/useAuth.jsx` to use backend `/auth/login` endpoint instead of Supabase
   - Now uses MongoDB user database directly

2. **Created Admin User in Database**
   - Ran seed script (`npm run seed`) to create admin user
   - Admin user now exists in MongoDB with credentials:
     - Email: `kittu8441@gmail.com`
     - Password: `123456`

3. **Authentication Flow**
   - Frontend sends credentials to backend `/auth/login`
   - Backend verifies password and returns JWT token
   - Token stored in localStorage
   - Admin dashboard can now fetch users and properties

## How to Login

1. Go to **http://localhost:8081/**
2. Click **"Sign In"** tab
3. Enter credentials:
   - Email: `kittu8441@gmail.com`
   - Password: `123456`
4. Click **"Sign In"**

## What's Now Working

✅ **Admin Login** - Uses backend JWT authentication
✅ **Admin Dashboard Access** - Admin link appears in header
✅ **User Management** - Shows all registered users
✅ **Property Management** - Shows all properties
✅ **User Deletion** - Can delete users with cascade delete
✅ **Property Deletion** - Can delete properties

## Files Modified

1. **src/hooks/useAuth.jsx** - Switched from Supabase to backend authentication
2. **backend/seed-admin.js** - NEW: Script to create admin user
3. **backend/package.json** - Added `npm run seed` command

## Authentication Details

**Before (Supabase):**
```javascript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**After (Backend JWT):**
```javascript
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

## Backend Endpoints Used

- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Register new user
- `GET /auth/all-users` - Get all users (admin-only)
- `DELETE /auth/users/:userId` - Delete user (admin-only)
- `GET /properties` - Get all properties
- `DELETE /properties/:id` - Delete property (admin override)

## Token Storage

- JWT token stored in `localStorage.getItem("token")`
- User data stored in `localStorage.getItem("user")`
- Token sent in all API requests as `Authorization: Bearer {token}`
- Backend middleware verifies token on protected routes

## Admin Verification

Admin status is checked by email:
```javascript
if (user?.email === "kittu8441@gmail.com") {
  // Show admin features
}
```

## Database Seeding

If you need to recreate the admin user:
```bash
cd backend
npm run seed
```

This will:
- Check if admin already exists
- Create admin if doesn't exist
- Return success/error message

---

**Status:** ✅ Admin login is now fully functional!

You can now log in with admin credentials and access the admin dashboard to manage users and properties.

