# ✅ Quick Deployment Checklist

## 🚀 Deploy in 10 Minutes!

### Step 1: Backend (Railway) - 3 minutes

```bash
# 1. Go to backend folder
cd d:\project_lend\backend

# 2. Initialize git
git init
git add .
git commit -m "Initial commit"

# 3. Create GitHub repo and push
# (Create repo on github.com first)
git remote add origin https://github.com/YOUR_USERNAME/sublendx-backend.git
git branch -M main
git push -u origin main

# 4. Deploy on Railway
# - Go to railway.app
# - Click "New Project" → "Deploy from GitHub"
# - Select your repo
# - Add environment variables (see DEPLOYMENT.md)
# - Copy the deployed URL
```

**Backend URL:** `_________________________` (Save this!)

---

### Step 2: Frontend (Vercel) - 5 minutes

```bash
# 1. Update frontend .env with backend URL
# Edit: d:\project_lend\frontend\.env
# Change: NEXT_PUBLIC_API_BASE_URL=https://YOUR-RAILWAY-URL/api

# 2. Go to frontend folder
cd d:\project_lend\frontend

# 3. Initialize git
git init
git add .
git commit -m "Initial commit"

# 4. Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/sublendx-frontend.git
git branch -M main
git push -u origin main

# 5. Deploy on Vercel
# - Go to vercel.com
# - Click "New Project"
# - Import your repo
# - Add environment variables (see DEPLOYMENT.md)
# - Deploy!
```

**Frontend URL:** `_________________________` (Your live app!)

---

### Step 3: Test - 2 minutes

1. ✅ Visit your frontend URL
2. ✅ Connect wallet
3. ✅ List a subscription
4. ✅ View in marketplace
5. ✅ Rent it!

---

## 🎉 You're Live!

**Your App:** https://your-frontend.vercel.app
**API:** https://your-backend.railway.app
**Blockchain:** Ethereum Sepolia (already deployed)

---

## 📝 Environment Variables Summary

### Backend (Railway)
```
PORT=3002
SUPABASE_URL=https://doqslzidmmkdnaqqqwlo.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-secret-key
BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_BASE_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

---

## 🔄 Update Later

**Push changes:**
```bash
git add .
git commit -m "Update"
git push
```

Both Railway and Vercel auto-deploy on push! 🚀
