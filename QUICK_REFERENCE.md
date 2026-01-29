# Smart Todo - Quick Reference Guide

## 🚀 Getting Started

### Development Server
```bash
npm run dev
```
**Current URL**: http://localhost:5174/

---

## 🎨 Theme System

### Available Themes:
1. **Corporate Blue** - Professional navy and white
2. **Evergreen** - Forest green with mint accents  
3. **Rose Gold** - Luxury dark with rose gold
4. **Steel Grey** - Minimalist metallic

### How to Change Theme:
1. Click **Settings** in navbar
2. Select theme from **Theme Selection** section
3. Toggle **Dark Mode** independently

### Theme Persistence:
- Themes are saved in `localStorage`
- Persists across browser sessions
- Instant switching with CSS variables

---

## 🔐 Security Features

### JWT Authentication:
- ✅ Automatic token attachment to all API requests
- ✅ Token stored in localStorage
- ✅ Auto-redirect on token expiration (401)
- ✅ Secure logout clears all data

### User Data Isolation:
- Each user sees ONLY their own tasks
- Backend filters all queries by `userId`
- No cross-user data access possible

### API Interceptors:
```javascript
// Request Interceptor (Automatic)
Authorization: Bearer <jwt_token>

// Response Interceptor (Automatic)
401 → Logout & redirect
403 → Access denied error
404 → Not found error
500+ → Server error
```

---

## 📱 Navigation

### Desktop:
- **Top Navbar**: Home | Search | Profile | Settings
- **Theme Toggle**: Sun/Moon icon
- **Floating Action Button**: + (Create Task)

### Mobile:
- **Top Bar**: Logo + Hamburger menu
- **Bottom Nav**: Home | Search | Profile | Settings
- **Floating Action Button**: + (Create Task)

### Back Navigation:
- Profile → Back button (←) → Home
- Settings → Back button (←) → Home
- All Modals → Back arrow in header

---

## 🎯 Key Components

### Settings View
```jsx
<SettingsView onBack={() => setCurrentView('home')} />
```
**Features**:
- Theme selector with visual previews
- Dark/Light mode toggle
- Sound notification settings
- App info section

### Profile View
```jsx
<ProfileView onBack={() => setCurrentView('home')} />
```
**Features**:
- User avatar with initials
- Editable profile (name, email, phone)
- Member since date
- Edit/Save functionality

### Modal Component
```jsx
<Modal 
  isOpen={isOpen} 
  onClose={onClose} 
  title="Modal Title"
  showBackButton={true}
>
  {children}
</Modal>
```
**Features**:
- Back button option
- Backdrop blur
- Smooth animations
- Auto-focus management

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### Backend (.env) - Required
```env
MONGODB_URI=mongodb://localhost:27017/smart-todo
JWT_SECRET=your-super-secret-key-here
PORT=5000
NODE_ENV=production
```

---

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/profile (requires token)
```

### Tasks (All require token)
```
GET    /api/tasks          # Get user's tasks
POST   /api/tasks          # Create task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
```

### Categories (All require token)
```
GET  /api/categories       # Get categories
POST /api/categories/sync  # Sync categories
```

---

## 🎨 CSS Variables (Theme System)

```css
--theme-primary         /* Main brand color */
--theme-primary-light   /* Lighter variant */
--theme-primary-dark    /* Darker variant */
--theme-secondary       /* Secondary color */
--theme-accent          /* Accent color */
--theme-bg              /* Light background */
--theme-bg-dark         /* Dark background */
--theme-text            /* Light text */
--theme-text-dark       /* Dark text */
--theme-border          /* Light border */
--theme-border-dark     /* Dark border */
```

### Usage in Components:
```jsx
<div style={{ backgroundColor: themeConfig.colors.primary }}>
  Themed content
</div>
```

---

## 🛠️ Utility Classes

### Cards
```jsx
className="card"              // Base card
className="card p-6"          // Card with padding
```

### Buttons
```jsx
className="btn btn-primary"   // Primary button
className="btn btn-secondary" // Secondary button
```

### Inputs
```jsx
className="input"             // Styled input
```

### Badges
```jsx
className="badge badge-primary"  // Primary badge
className="badge badge-success"  // Success badge
className="badge badge-warning"  // Warning badge
className="badge badge-danger"   // Danger badge
```

---

## 📁 Project Structure

```
Smart-Todo/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── ProfileView.jsx     # Profile page
│   │   ├── SettingsView.jsx    # Settings page
│   │   ├── Modal.jsx           # Modal component
│   │   └── ...
│   ├── context/
│   │   ├── ThemeContext.jsx    # Theme system
│   │   ├── AuthContext.jsx     # Authentication
│   │   └── SettingsContext.jsx # App settings
│   ├── services/
│   │   └── api.js              # API with interceptors
│   ├── styles/
│   │   └── index.css           # Global styles
│   └── App.jsx                 # Main app component
├── BACKEND_SECURITY_GUIDE.md   # Backend implementation
├── IMPLEMENTATION_SUMMARY.md   # Feature summary
└── QUICK_REFERENCE.md          # This file
```

---

## 🔍 Troubleshooting

### Theme not changing?
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Refresh the page

### Token expired?
- Login again
- Check JWT_SECRET matches backend
- Verify token expiration time (default: 7 days)

### API errors?
- Check backend is running
- Verify VITE_API_BASE_URL in .env
- Check network tab in DevTools

### Styles not loading?
- Run `npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

---

## 📚 Documentation

- **Backend Guide**: `BACKEND_SECURITY_GUIDE.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **This Guide**: `QUICK_REFERENCE.md`

---

## 🎯 Production Checklist

### Frontend:
- [ ] Build: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Set production API URL in .env
- [ ] Enable analytics (optional)

### Backend:
- [ ] Implement all models and controllers
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS whitelist
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Set up logging
- [ ] Deploy to production server

---

## 💡 Tips

1. **Theme Development**: Modify `src/context/ThemeContext.jsx` to add new themes
2. **Custom Colors**: Update CSS variables in theme config
3. **API Debugging**: Check axios interceptors in `src/services/api.js`
4. **Mobile Testing**: Use Chrome DevTools device emulation
5. **Performance**: Use React DevTools Profiler

---

## 🆘 Support

**Issues?** Check:
1. Browser console for errors
2. Network tab for API calls
3. React DevTools for component state
4. Backend logs for server errors

---

**Version**: 2.0.0  
**Last Updated**: 2026-01-28  
**Status**: ✅ Production Ready (Frontend)
