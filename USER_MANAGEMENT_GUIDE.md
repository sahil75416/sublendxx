# 🛠️ User Management Guide

## 📍 Where Users Are Stored

**File**: `d:\project_lend\backend\routes\auth.js` (Line 6)

```javascript
const usersStore = []; // In-memory array
```

**Important**: Users are stored **in-memory** for demo purposes. Data is **lost when you restart the backend**.

---

## 🎯 Three Ways to Manage Users

### **Method 1: Admin Dashboard (Visual Interface)** ⭐ RECOMMENDED

#### Access the Admin Dashboard:
1. Start your servers:
   ```bash
   # Backend
   cd d:\project_lend\backend
   node server.js

   # Frontend (new terminal)
   cd d:\project_lend\frontend
   npm run dev
   ```

2. Go to: **http://localhost:3000/admin**

#### Features:
- ✅ View all users in a table
- ✅ See statistics (total users, with/without wallets, recent signups)
- ✅ Delete individual users
- ✅ Clear all users
- ✅ Refresh data
- ✅ Beautiful UI with real-time updates

#### What You'll See:
```
╔═══════════════════════════════════════════════════════════╗
║              Admin Dashboard                              ║
╠═══════════════════════════════════════════════════════════╣
║  Total Users: 5   With Wallets: 3   Last 24h: 2         ║
╠═════════════════════════════════════════════════════════════
║ ID  | Name      | Email           | Wallet      | Actions║
║ 123 | John Doe  | john@test.com   | 0x1234...   | Delete ║
║ 456 | Jane Doe  | jane@test.com   | No wallet   | Delete ║
╚═════════════════════════════════════════════════════════════
```

---

### **Method 2: Backend Console Logs** 

The backend automatically logs user activity in the console.

#### Start Backend & Watch Console:
```bash
cd d:\project_lend\backend
node server.js
```

#### You'll See:
```
SubLendX Backend Server is running on port 3002

Signup request received: { name: 'John Doe', email: 'john@test.com' }
User created successfully: john@test.com
Total users: 1

Login request received: { email: 'john@test.com' }
User logged in successfully: john@test.com

Wallet linked: { email: 'john@test.com', wallet: '0x1234...' }
```

---

### **Method 3: API Endpoints (Direct)** 

Use these endpoints to manage users programmatically.

#### **View All Users**
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/admin/users" -Method GET
```

**Response:**
```json
{
  "success": true,
  "totalUsers": 2,
  "users": [
    {
      "id": 1728529234567,
      "name": "John Doe",
      "email": "john@test.com",
      "walletAddress": "0x1234567890abcdef",
      "createdAt": "2025-10-10T01:13:54.567Z"
    },
    {
      "id": 1728529345678,
      "name": "Jane Smith",
      "email": "jane@test.com",
      "walletAddress": null,
      "createdAt": "2025-10-10T01:15:45.678Z"
    }
  ]
}
```

#### **Get User Statistics**
```bash
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/admin/stats" -Method GET
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 2,
    "usersWithWallets": 1,
    "usersWithoutWallets": 1,
    "recentUsers24h": 2,
    "lastSignup": "2025-10-10T01:15:45.678Z"
  }
}
```

#### **Delete Specific User**
```bash
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/admin/users/1728529234567" -Method DELETE
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "deletedUser": {
    "id": 1728529234567,
    "email": "john@test.com",
    "name": "John Doe"
  }
}
```

#### **Clear All Users** (⚠️ DANGEROUS)
```bash
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/admin/clear-users" -Method POST
```

**Response:**
```json
{
  "success": true,
  "message": "All 2 users have been cleared",
  "clearedCount": 2
}
```

---

## 🔍 Available Admin Endpoints

### Summary:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/admin/users` | GET | Get all users (without passwords) |
| `/api/auth/admin/stats` | GET | Get user statistics |
| `/api/auth/admin/users/:userId` | DELETE | Delete specific user by ID |
| `/api/auth/admin/clear-users` | POST | Delete ALL users (dangerous!) |

---

## 📊 User Data Structure

Each user object contains:

```javascript
{
  id: 1728529234567,              // Timestamp-based ID
  name: "John Doe",               // User's full name
  email: "john@test.com",         // Email (lowercase)
  password: "$2a$10$hashed...",    // Bcrypt hashed password
  walletAddress: "0x1234...",     // Linked wallet (optional)
  createdAt: "2025-10-10T..."     // ISO timestamp
}
```

---

## 🎨 Admin Dashboard Features

### Statistics Cards:
- **Total Users**: Total registered accounts
- **With Wallets**: Users who linked crypto wallets
- **Without Wallets**: Users without wallets
- **Last 24h**: New signups in last 24 hours

### Users Table:
- User ID (timestamp)
- Full name
- Email address
- Wallet address (if linked)
- Creation date & time
- Delete button

### Actions:
- **🔄 Refresh**: Reload data from backend
- **⚠️ Clear All**: Delete all users (with double confirmation)
- **Delete**: Remove individual user

---

## 🔐 Security Considerations

### Current Setup (Demo):
- ❌ No admin authentication (anyone can access /admin)
- ❌ No password verification for delete operations
- ❌ In-memory storage (data lost on restart)

### Production Recommendations:
- ✅ Add admin authentication (require login)
- ✅ Implement role-based access control
- ✅ Add audit logging for admin actions
- ✅ Use database instead of in-memory storage
- ✅ Add pagination for large user lists
- ✅ Export user data to CSV/Excel

---

## 🚀 Quick Testing Workflow

### 1. Create Test Users:
```bash
# Go to signup page
http://localhost:3000/signup

# Create 3-5 test accounts
User 1: test1@test.com / Test1234!
User 2: test2@test.com / Test1234!
User 3: test3@test.com / Test1234!
```

### 2. View in Admin Dashboard:
```bash
# Open admin dashboard
http://localhost:3000/admin

# You should see all 3 users
```

### 3. Test Deletion:
- Click "Delete" on User 2
- Refresh page
- User 2 should be gone

### 4. Check Console:
```bash
# In backend terminal, you'll see:
User deleted by admin: test2@test.com
```

---

## 🔧 Debugging Tips

### Check if users exist:
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/admin/users"
```

### View backend logs:
```bash
# Backend terminal shows all user activity:
Signup request received: { name: '...', email: '...' }
User created successfully: ...
Total users: X
```

### Test user creation:
```bash
# Create user via API directly
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Test User","email":"test@test.com","password":"Test1234!"}'
```

---

## 📈 Future Enhancements

### Phase 1: Database Integration
- Replace `usersStore` array with Supabase
- Persistent storage across restarts
- Query optimization

### Phase 2: Advanced Admin Features
- Search & filter users
- Sort by name, email, date
- Pagination (10/20/50 per page)
- Export to CSV/Excel
- Bulk operations (delete multiple)

### Phase 3: User Management
- Edit user details
- Reset user passwords
- Ban/unban users
- View user activity logs
- Send email notifications

### Phase 4: Security
- Admin authentication (separate admin login)
- Role-based permissions (admin, moderator)
- Two-factor authentication for admin
- Audit logs for all admin actions
- IP whitelisting

---

## ✅ Summary

### **Best Method for Quick Viewing:**
👉 **Use Admin Dashboard**: http://localhost:3000/admin

### **Best Method for Monitoring:**
👉 **Watch Backend Console**: Real-time logs

### **Best Method for Automation:**
👉 **Use API Endpoints**: Programmatic access

### **Storage Location:**
👉 **`backend/routes/auth.js`**: Line 6 (`usersStore` array)

---

## 🎯 Quick Commands

```bash
# Start backend with logging
cd d:\project_lend\backend
node server.js

# Open admin dashboard
start http://localhost:3000/admin

# View all users (PowerShell)
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/admin/users"

# Get stats
Invoke-RestMethod -Uri "http://localhost:3002/api/auth/admin/stats"
```

---

**Happy User Managing!** 🎉

**Last Updated**: 2025-10-10
