# Authentication System Guide

## 🔐 Email-Based Authentication

Your SubLendX platform now has a complete email-based authentication system to keep user accounts safe!

---

## ✨ Features Implemented

### 1. **Login Page** (`/login`)
- Email & password authentication
- Remember me checkbox
- Forgot password link
- Social login placeholders (Facebook, GitHub)
- Beautiful gradient design
- Auto-redirect if already logged in

### 2. **Signup Page** (`/signup`)
- Name, email, password fields
- Password confirmation
- Real-time password strength indicator
- Terms & conditions checkbox
- Form validation
- Auto-redirect if already logged in

### 3. **Backend Authentication Routes**
- **POST `/api/auth/signup`** - Create new account
- **POST `/api/auth/login`** - Login with email/password
- **GET `/api/auth/verify`** - Verify JWT token
- **POST `/api/auth/logout`** - Logout user
- **POST `/api/auth/link-wallet`** - Link wallet to account
- **GET `/api/auth/profile`** - Get user profile

### 4. **Enhanced Navbar**
- Shows "Login" & "Sign Up" buttons when logged out
- Shows user avatar & name when logged in
- Dropdown menu with:
  - User name & email
  - My Subscriptions link
  - Logout button
- Separate wallet connection section
- User profile indicator with first letter

### 5. **Security Features**
- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Email validation
- Password strength requirements (8+ characters)
- In-memory user storage (demo mode)

---

## 🧪 Testing the Authentication System

### **Step 1: Install Dependencies**

First, install required packages:

```bash
cd d:\project_lend\backend
npm install bcryptjs jsonwebtoken
```

### **Step 2: Start Backend**

```bash
cd d:\project_lend\backend
node server.js
```

You should see:
```
SubLendX Backend Server is running on port 3002
```

### **Step 3: Start Frontend**

```bash
cd d:\project_lend\frontend
npm run dev
```

### **Step 4: Test Signup Flow**

1. Go to http://localhost:3000
2. Click **"Sign Up"** button in navbar
3. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: SecurePass123!
   - **Confirm Password**: SecurePass123!
4. Check the password strength indicator (should show "Strong")
5. Check the terms checkbox
6. Click **"Create Account"**
7. ✅ See success toast: "Account created successfully!"
8. ✅ Auto-redirect to home page
9. ✅ See your name in navbar with avatar

### **Step 5: Test User Menu**

1. Click on your name/avatar in navbar
2. ✅ Dropdown menu appears showing:
   - Your name
   - Your email
   - "My Subscriptions" link
   - "Logout" button

### **Step 6: Test Logout**

1. Click **"Logout"** in the dropdown
2. ✅ See success toast: "Logged out successfully"
3. ✅ Navbar shows "Login" & "Sign Up" buttons again

### **Step 7: Test Login Flow**

1. Click **"Login"** button in navbar
2. Fill in credentials:
   - **Email**: john@example.com
   - **Password**: SecurePass123!
3. Click **"Login"**
4. ✅ See success toast: "Login successful!"
5. ✅ Auto-redirect to home page
6. ✅ See your name in navbar

### **Step 8: Test Persistence**

1. While logged in, **refresh the page** (F5)
2. ✅ Still logged in (localStorage persistence)
3. ✅ User name still shows in navbar

### **Step 9: Test Wallet + Account**

1. Login to your account
2. Click **"Connect Wallet"**
3. Connect Coinbase Wallet
4. ✅ Both user account AND wallet address show in navbar
5. Now you can rent/list subscriptions with account security!

---

## 📊 Data Flow

### Signup Flow:
```
User fills form → Frontend validates → 
POST /api/auth/signup → Backend validates → 
Hash password → Store user → Generate JWT → 
Return token → Store in localStorage → 
Show user in navbar
```

### Login Flow:
```
User enters credentials → Frontend validates → 
POST /api/auth/login → Backend finds user → 
Compare password hash → Generate JWT → 
Return token → Store in localStorage → 
Show user in navbar
```

### Auto-Login Flow:
```
Page loads → Check localStorage → 
Find authToken → GET /api/auth/verify → 
Verify JWT → Return user data → 
Show user in navbar
```

---

## 🔒 Security Features

### Password Requirements:
- ✅ Minimum 8 characters
- ✅ Mix of uppercase & lowercase
- ✅ Numbers
- ✅ Special characters

### Password Strength Levels:
- **Weak** (1 point): Only length requirement met
- **Fair** (2 points): Length + case mix
- **Good** (3 points): Length + case + numbers
- **Strong** (4 points): All requirements met

### JWT Token:
- **Algorithm**: HS256
- **Expiration**: 7 days
- **Payload**: userId, email
- **Storage**: localStorage (frontend)

### Password Hashing:
- **Algorithm**: bcrypt
- **Salt rounds**: 10
- **Storage**: In-memory (demo mode)

---

## 📝 User Data Structure

```javascript
{
  id: 1234567890,              // Timestamp ID
  name: "John Doe",            // Full name
  email: "john@example.com",   // Lowercase email
  password: "$2a$10$...",       // Hashed password
  walletAddress: "0x...",      // Linked wallet (optional)
  createdAt: "2025-10-10T..."  // ISO timestamp
}
```

---

## 🎨 UI Components

### Login Page:
- Centered card design
- SubLendX logo & tagline
- Email & password fields
- Remember me checkbox
- Forgot password link
- Social login buttons
- Sign up link
- Back to home link

### Signup Page:
- Similar design to login
- Additional name field
- Password confirmation
- Real-time strength indicator
- Progress bar (weak → strong)
- Terms & conditions
- Login link

### Navbar:
**Logged Out:**
- Marketplace link
- My Subscriptions link
- Login button (text)
- Sign Up button (primary)
- Connect Wallet button (secondary)

**Logged In:**
- Marketplace link
- My Subscriptions link
- User avatar (circle with initial)
- User name
- Dropdown arrow
- Connect Wallet (separate section)

### User Dropdown Menu:
- User name (bold)
- Email (small, gray)
- Divider
- My Subscriptions link
- Logout button (red)

---

## 🔗 API Endpoints

### POST /api/auth/signup
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "userId": 1234567890,
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Account created successfully"
}
```

### POST /api/auth/login
**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "userId": 1234567890,
  "name": "John Doe",
  "email": "john@example.com",
  "walletAddress": "0x...",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login successful"
}
```

### GET /api/auth/verify
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "success": true,
  "userId": 1234567890,
  "name": "John Doe",
  "email": "john@example.com",
  "walletAddress": "0x..."
}
```

---

## 🚀 Next Steps (Future Enhancements)

### Phase 2: Email Verification
- Send verification email on signup
- Verify email before allowing rentals
- Resend verification link

### Phase 3: Password Reset
- Forgot password flow
- Email reset link
- Reset password page

### Phase 4: Database Integration
- Replace in-memory storage with Supabase
- Persistent user accounts
- Session management

### Phase 5: Social Login
- Facebook OAuth
- Google OAuth
- GitHub OAuth
- Twitter OAuth

### Phase 6: Two-Factor Authentication
- SMS verification
- Authenticator app
- Email OTP

---

## ✅ Benefits of Authentication

1. **Account Security**: Email/password protects user data
2. **Profile Management**: Save preferences and history
3. **Wallet Protection**: Link wallet to verified email
4. **Transaction History**: Track all rentals and listings
5. **Recovery Options**: Reset password if forgotten
6. **Trust & Safety**: Verified users only
7. **Communication**: Email notifications for rentals
8. **Analytics**: User activity tracking

---

## 🔧 Configuration

### Environment Variables:
Add to `backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3002
```

### Frontend Storage:
Data stored in `localStorage`:
- `userEmail` - User's email
- `userId` - User's ID
- `userName` - User's name
- `authToken` - JWT token
- `walletAddress` - Connected wallet

---

## 🐛 Troubleshooting

### "Email already registered"
- **Cause**: Email exists in database
- **Fix**: Use different email or login

### "Invalid email or password"
- **Cause**: Wrong credentials
- **Fix**: Check email/password or signup

### Token expired
- **Cause**: JWT expired (7 days)
- **Fix**: Login again

### Not redirecting after login
- **Cause**: LocalStorage not saving
- **Fix**: Check browser settings

---

## 📚 Summary

✅ **Complete email authentication system**  
✅ **Beautiful login & signup pages**  
✅ **Password strength indicator**  
✅ **User profile in navbar**  
✅ **JWT token security**  
✅ **Password hashing (bcrypt)**  
✅ **LocalStorage persistence**  
✅ **Logout functionality**  
✅ **Form validation**  
✅ **Error handling**  

**Your platform now has secure user accounts!** 🎉

---

**Created**: 2025-10-10  
**Version**: 1.0
