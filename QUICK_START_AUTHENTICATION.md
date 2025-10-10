# 🚀 Quick Start: Authentication System

## Step 1: Install Dependencies

### Backend:
```bash
cd d:\project_lend\backend
npm install
```

This will install:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

### Frontend:
Already has all required dependencies.

---

## Step 2: Start Backend

```bash
cd d:\project_lend\backend
node server.js
```

**Expected Output:**
```
SubLendX Backend Server is running on port 3002
```

---

## Step 3: Start Frontend

```bash
cd d:\project_lend\frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
```

---

## Step 4: Test Authentication

### Create an Account:

1. Go to: http://localhost:3000
2. Click **"Sign Up"** (top right)
3. Fill in:
   - Name: **Your Name**
   - Email: **your@email.com**
   - Password: **Test1234!** (must be 8+ chars, with mix of letters, numbers, symbols)
   - Confirm Password: **Test1234!**
4. Check "I agree to Terms" checkbox
5. Click **"Create Account"**
6. ✅ You'll see: "Account created successfully!"
7. ✅ Redirected to home page
8. ✅ Your name appears in navbar with avatar

### Test User Menu:

1. Click your name/avatar in navbar
2. See dropdown with:
   - Your name & email
   - My Subscriptions link
   - Logout button

### Test Logout:

1. Click **"Logout"**
2. ✅ See: "Logged out successfully"
3. ✅ Navbar shows "Login" & "Sign Up" again

### Test Login:

1. Click **"Login"**
2. Enter your email & password
3. Click **"Login"**
4. ✅ See: "Login successful!"
5. ✅ Logged back in with your account

### Test with Wallet:

1. Login to your account
2. Click **"Connect Wallet"**
3. Connect Coinbase Wallet
4. ✅ Both account AND wallet show in navbar
5. Now you can rent/list subscriptions securely!

---

## 🎨 What You'll See

### When NOT Logged In:
```
[SubLendX]  [Marketplace]  [My Subscriptions]  [Login]  [Sign Up]  [Connect Wallet]
```

### When Logged In:
```
[SubLendX]  [Marketplace]  [My Subscriptions]  [👤 John]  |  [0x1234...5678]
```

### Click Your Name:
```
┌─────────────────┐
│ John Doe        │
│ john@email.com  │
├─────────────────┤
│ My Subscriptions│
│ Logout          │
└─────────────────┘
```

---

## ✅ Features Working

### Login Page (`/login`):
- ✅ Email & password fields
- ✅ Form validation
- ✅ Remember me option
- ✅ Social login placeholders
- ✅ Sign up link

### Signup Page (`/signup`):
- ✅ Name, email, password fields
- ✅ Password confirmation
- ✅ Real-time password strength indicator:
  - 🔴 Weak
  - 🟡 Fair
  - 🔵 Good
  - 🟢 Strong
- ✅ Terms checkbox
- ✅ Login link

### Navbar:
- ✅ Shows user avatar & name when logged in
- ✅ Dropdown menu with logout
- ✅ Separate wallet connection
- ✅ Login/Signup buttons when logged out

### Backend:
- ✅ `/api/auth/signup` - Create account
- ✅ `/api/auth/login` - Login
- ✅ `/api/auth/logout` - Logout
- ✅ `/api/auth/verify` - Verify token
- ✅ Password hashing with bcrypt
- ✅ JWT token with 7-day expiration

---

## 🔒 Security

### Password Requirements:
- Minimum 8 characters
- Mix of uppercase & lowercase
- Numbers recommended
- Special characters for "Strong" rating

### Data Storage:
- **Backend**: In-memory (demo mode)
- **Frontend**: localStorage
  - `userEmail`
  - `userId`
  - `userName`
  - `authToken`

### Token Security:
- JWT with HS256 algorithm
- 7-day expiration
- Stored in localStorage
- Sent in Authorization header

---

## 🐛 Common Issues

### "Cannot find module 'bcryptjs'"
**Solution:**
```bash
cd backend
npm install bcryptjs jsonwebtoken
```

### "Email already registered"
**Solution:** Use a different email or login with existing account

### Not staying logged in
**Solution:** Check browser localStorage is enabled

### Backend not starting
**Solution:** Make sure port 3002 is available

---

## 📖 Full Documentation

See `AUTHENTICATION_GUIDE.md` for complete details on:
- API endpoints
- Data structures
- Security features
- Future enhancements

---

## 🎉 You're All Set!

Your SubLendX platform now has:
- ✅ Secure email authentication
- ✅ Beautiful login/signup pages
- ✅ User profiles in navbar
- ✅ Password hashing
- ✅ JWT tokens
- ✅ Wallet + account integration

**Start testing now!** 🚀
