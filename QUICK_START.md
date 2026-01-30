# 🚀 Quick Start Guide

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd /Users/commando_life/Desktop/backend/TODO-Backend
   ```

2. **Start the backend server:**
   ```bash
   npm start
   # or if you have nodemon:
   npm run dev
   ```

3. **Verify backend is running:**
   - You should see: `🚀 Server running on port 5001`
   - Test endpoint: http://localhost:5001/

## Frontend Setup

The frontend is already running! Just verify:

1. **Check if dev server is running:**
   - Should be on http://localhost:5173 (or similar)
   - Terminal shows: `npm run dev` running

2. **If not running, start it:**
   ```bash
   cd /Users/commando_life/Desktop/frontend/TODO-FRONT
   npm run dev
   ```

## Testing the Integration

### 1. Test Basic Connection
- Open browser to http://localhost:5173
- Open DevTools Console (F12)
- Login or Register
- Check Network tab for API calls to `http://localhost:5001/api`

### 2. Test Student Portal
- Click on "Student" tab in navigation
- Click "New Goal" button
- Fill in:
  - Goal Name: "Learn React"
  - Description: "Master React hooks and state management"
  - Total Hours: 10
- Click "Create Goal"
- Goal should appear in the list

### 3. Test Focus Session
- Click "Start Goal" on any goal
- Shield Mode should activate (full screen)
- Listen for voice announcement: "Starting focus session for [goal name]"
- Let timer run for a minute
- Click "Complete Session"
- Listen for completion voice message
- Check if session was saved (refresh page and verify data persists)

### 4. Test Voice Features
**Make sure:**
- Browser has microphone/speaker permissions
- Volume is turned on
- Using Chrome, Safari, or Edge (best support for Web Speech API)

**Voice announcements happen at:**
- Session start
- Every 15 minutes (15, 30, 45, 60)
- Session completion
- Goal completion

## Troubleshooting

### Backend not connecting?
1. Check if backend is running on port 5001
2. Verify MongoDB is connected
3. Check `.env` file in backend has correct `MONGO_URI`

### Frontend not showing data?
1. Check browser console for errors
2. Verify `.env` has `VITE_API_BASE_URL=http://localhost:5001/api`
3. Restart frontend dev server after changing .env

### Voice not working?
1. Check browser console for errors
2. Try Chrome (best support)
3. Check system volume
4. Grant microphone permissions if prompted

### Data not persisting?
1. Check if you're logged in (JWT token required)
2. Verify backend MongoDB connection
3. Check Network tab for 401 errors (authentication issues)

## API Endpoints Reference

### Goals
- `GET /api/goals` - Get all user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/sessions` - Add study session

### Tasks (existing)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users (existing)
- `POST /api/users/register` - Register
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get profile

## Success Indicators

✅ Backend console shows: "🚀 Server running on port 5001"
✅ Frontend loads without errors
✅ Can create and view goals
✅ Voice announcements play
✅ Data persists after page refresh
✅ Mobile navigation doesn't overlap content
✅ Modals appear above navigation bar

## Need Help?

Check the detailed documentation in:
- `BACKEND_INTEGRATION_SUMMARY.md` - Full technical details
- Browser DevTools Console - Error messages
- Backend terminal - Server logs
