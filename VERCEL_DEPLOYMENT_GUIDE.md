# Vercel Deployment Guide for VIVALY

## Issue: Login fails on Vercel with "The string did not match the expected pattern"

This error occurs because the frontend is trying to connect to localhost instead of your actual backend URL.

## Solution Steps

### 1. Configure Your Backend URL

**Option A: Separate Backend Deployment**
If your backend is deployed separately (e.g., on Railway, Heroku, or another Vercel project):

1. In your Vercel project dashboard, go to Settings → Environment Variables
2. Add this environment variable:
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.com
   ```

**Option B: Same-Origin Deployment (Recommended)**
If your frontend and backend are deployed together on the same Vercel project:

1. In your Vercel project dashboard, go to Settings → Environment Variables
2. Add this environment variable:
   ```
   Name: VITE_API_URL
   Value: (leave empty - no value)
   ```

### 2. Update Your Backend Configuration

Make sure your backend handles CORS properly for your frontend domain:

```typescript
// In your Express server setup
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
}));
```

### 3. Session Configuration for Production

Ensure your session configuration works with HTTPS:

```typescript
app.use(session({
  // ... other config
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.your-domain.com' : undefined
  }
}));
```

### 4. Debug Login Issues

The enhanced error handling will now show detailed logs in your browser console:
- Open browser Developer Tools (F12)
- Go to Console tab
- Attempt login
- Check for API request/response logs

### 5. Common Vercel Deployment Issues

**CORS Errors:**
- Add your Vercel domain to CORS origins
- Ensure credentials: true is set

**Session Issues:**
- Set secure: true for HTTPS
- Configure sameSite appropriately
- Check cookie domain settings

**API URL Issues:**
- Verify VITE_API_URL environment variable
- Check that API calls show correct URLs in console

## Testing Your Fix

1. Deploy with updated environment variables
2. Open browser console on your deployed site
3. Attempt login
4. Check console logs for:
   - API Request URLs (should not contain localhost)
   - Response status codes
   - Any CORS or network errors

## Environment Variable Summary

For development (.env):
```
VITE_API_URL=http://localhost:5000
```

For production (Vercel environment variables):
```
VITE_API_URL=https://your-backend-url.com
# OR leave empty for same-origin deployment
```