# Testing Guide - Authentication Fix

## What Changed
1. **Backend Auth**: Simplified to just decode JWT tokens from localStorage (no Supabase)
2. **Frontend Token Storage**: useAuth hook stores Supabase `session.access_token` to localStorage
3. **API Calls**: Include Authorization header with `Bearer {token}`
4. **Debugging**: Added console logs to track token presence and validation

## Testing Steps

### Step 1: Sign In
1. Go to http://localhost:8080
2. Click "Sign In" or "Sign Up"
3. Create or use an account

### Step 2: Check Token Storage
1. Open DevTools → Application → Local Storage
2. Look for a key called "token"
3. It should contain a long JWT-like string

### Step 3: Try Creating a Property
1. Click "Create Property" in the navigation
2. Fill in the form and submit
3. **Check Frontend Console** (F12):
   - Should see: `✓ Token added to request for /properties` OR
   - Should see: `⚠️ No token in localStorage for /properties`

### Step 4: Check Backend Logs
1. Look at the backend terminal
2. Should see one of:
   - `✓ Token decoded successfully` → `✓ User authenticated: email@example.com`
   - OR `❌ No token provided in Authorization header`
   - OR `❌ Failed to decode token`

## Troubleshooting

### Issue: "⚠️ No token in localStorage"
**Cause**: User not authenticated or token not stored
**Fix**: 
1. Make sure you're signed in
2. Clear localStorage and sign in again
3. Check useAuth hook is running (look for setItem calls in console)

### Issue: "✓ Token added but still 403 error"
**Cause**: Token exists but isn't valid JWT format
**Fix**:
1. Check token value in localStorage (should start with "eyJ")
2. Go to https://jwt.io and paste the token to decode it
3. Verify it has `sub` and `email` fields

### Issue: Backend shows "No token provided"
**Cause**: Authorization header not being sent
**Fix**:
1. Check Network tab → properties request → Headers → Authorization
2. Should show: `Authorization: Bearer eyJ...`
3. If missing, check api.js has correct header code

### Issue: Backend shows "Token decoded but no user fields"
**Cause**: Token structure doesn't match expected format
**Fix**:
1. Decode the token to see what fields it has
2. Update auth.js to extract correct fields
3. Supabase tokens should have: `sub`, `email`, `user_metadata`

## Success Indicators
✅ Frontend console shows token being added to request
✅ Backend logs show user being authenticated
✅ Property created successfully
✅ 200 response (not 403)
