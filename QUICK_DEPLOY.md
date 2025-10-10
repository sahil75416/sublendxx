# ⚡ Quick Deploy Reference Card

## 📋 Checklist

### Before You Start:
- [ ] Git installed (`git --version`)
- [ ] GitHub account created
- [ ] Vercel account created (vercel.com)
- [ ] Backend URL ready to copy

---

## 🔷 BACKEND DEPLOYMENT (15 min)

### 1. Create GitHub Repo
```
github.com → New repository → "sublendx-backend" → Create
```

### 2. Push Code
```powershell
cd d:\project_lend\backend
git init
git add .
git commit -m "Deploy backend"
git remote add origin https://github.com/YOUR_USERNAME/sublendx-backend.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Vercel
```
vercel.com → Add New Project → Import sublendx-backend
```

### 4. Add Environment Variables (8 total)
```
PORT=3002
SUPABASE_URL=https://doqslzidmmkdnaqqqwlo.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcXNsemlkbW1rZG5hcXFxd2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDc4MTAsImV4cCI6MjA3NTQyMzgxMH0.MIb7oihOqKklBi2WnnRXQoj4DG_t-E73FfQN4ly7uuA
JWT_SECRET=sublendx-secret-2024
BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
NODE_ENV=production
```

### 5. Test Backend
```
https://YOUR-BACKEND.vercel.app/health
```
Should return: `{"status":"OK",...}`

✅ Backend URL: ________________________________

---

## 🔶 FRONTEND DEPLOYMENT (10 min)

### 1. Update Frontend .env
```
Edit: d:\project_lend\frontend\.env

NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND.vercel.app/api
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

### 2. Create GitHub Repo
```
github.com → New repository → "sublendx-frontend" → Create
```

### 3. Push Code
```powershell
cd d:\project_lend\frontend
git init
git add .
git commit -m "Deploy frontend"
git remote add origin https://github.com/YOUR_USERNAME/sublendx-frontend.git
git branch -M main
git push -u origin main
```

### 4. Deploy on Vercel
```
vercel.com → Add New Project → Import sublendx-frontend
```

### 5. Add Environment Variables (4 total)
```
NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND.vercel.app/api
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

### 6. Visit Your Live App!
```
https://YOUR-FRONTEND.vercel.app
```

✅ Frontend URL: ________________________________

---

## 🎯 Test Your App

1. Visit frontend URL
2. Connect wallet
3. Go to "My Subscriptions"
4. Click "List Subscription"
5. Fill form and mint NFT
6. Go to "Marketplace"
7. See your listing! 🎉

---

## 🔄 Update Later

```powershell
# Make changes to code
git add .
git commit -m "Update"
git push
# Vercel auto-deploys!
```

---

## 🆘 Quick Troubleshooting

**Push fails?**
```powershell
git remote set-url origin https://github.com/USER/REPO.git
```

**Backend not working?**
- Check Vercel logs
- Verify env vars
- Test /health endpoint

**Frontend can't reach backend?**
- Check NEXT_PUBLIC_API_BASE_URL
- Must include /api at end
- Redeploy frontend after env change

---

## 📝 Your URLs

Fill these in after deployment:

```
Backend:  https://________________________________.vercel.app
Frontend: https://________________________________.vercel.app

AccessNFT: 0xF23e4962354b4e135ab540400a10e4F7cB6F250e
RentalEscrow: 0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

---

## 💰 Total Cost: $0

Everything is FREE! 🎉

---

**For detailed step-by-step instructions, see `VERCEL_STEP_BY_STEP.md`**
