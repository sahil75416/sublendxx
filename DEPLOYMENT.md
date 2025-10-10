# 🚀 SubLendX Deployment Guide

## 📋 Overview

This guide will help you deploy:
1. **Backend (Express API)** → Railway
2. **Frontend (Next.js)** → Vercel
3. **Smart Contracts** → Already deployed on Ethereum Sepolia ✅

---

## 1️⃣ Deploy Backend to Railway

### Prerequisites
- GitHub account
- Railway account (https://railway.app)

### Steps

1. **Create Git Repository**
   ```bash
   cd d:\project_lend\backend
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub (e.g., `sublendx-backend`)
   - Follow GitHub's instructions to push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sublendx-backend.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `sublendx-backend` repository
   - Railway will auto-detect Node.js and deploy

4. **Add Environment Variables**
   In Railway dashboard → Variables tab, add:
   ```
   PORT=3002
   SUPABASE_URL=https://doqslzidmmkdnaqqqwlo.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcXNsemlkbW1rZG5hcXFxd2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDc4MTAsImV4cCI6MjA3NTQyMzgxMH0.MIb7oihOqKklBi2WnnRXQoj4DG_t-E73FfQN4ly7uuA
   JWT_SECRET=your-secret-key-change-in-production
   BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
   ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
   RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
   ```

5. **Get Your Backend URL**
   - Railway will provide a URL like: `https://sublendx-backend-production.up.railway.app`
   - Save this URL for frontend configuration

---

## 2️⃣ Deploy Frontend to Vercel

### Prerequisites
- Vercel account (https://vercel.com)

### Steps

1. **Update Frontend .env with Production Backend URL**
   
   Edit `d:\project_lend\frontend\.env`:
   ```env
   # API Configuration (Update with Railway URL)
   NEXT_PUBLIC_API_BASE_URL=https://YOUR-RAILWAY-URL.up.railway.app/api

   # Ethereum Sepolia Network Configuration
   NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com

   # Contract Addresses (Ethereum Sepolia)
   NEXT_PUBLIC_ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
   NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
   ```

2. **Create Git Repository**
   ```bash
   cd d:\project_lend\frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   ```

3. **Push to GitHub**
   - Create a new repository on GitHub (e.g., `sublendx-frontend`)
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sublendx-frontend.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your `sublendx-frontend` repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

5. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
   NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
   NEXT_PUBLIC_ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
   NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
   ```

6. **Redeploy**
   - After adding env vars, trigger a new deployment

7. **Get Your Frontend URL**
   - Vercel provides: `https://sublendx-frontend.vercel.app`

---

## 3️⃣ Smart Contracts (Already Deployed) ✅

Your contracts are live on Ethereum Sepolia:
- **AccessNFT**: `0xF23e4962354b4e135ab540400a10e4F7cB6F250e`
- **RentalEscrow**: `0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91`

View on Etherscan:
- https://sepolia.etherscan.io/address/0xF23e4962354b4e135ab540400a10e4F7cB6F250e
- https://sepolia.etherscan.io/address/0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91

---

## 🔗 Final URLs

After deployment, you'll have:

- **Frontend**: https://sublendx-frontend.vercel.app
- **Backend**: https://sublendx-backend-production.up.railway.app
- **Blockchain**: Ethereum Sepolia Testnet

---

## 🧪 Test Deployment

1. Visit your frontend URL
2. Connect wallet (MetaMask/Coinbase Wallet)
3. List a subscription
4. View in marketplace
5. Rent it from another account

---

## 🔄 Update Deployment

**Backend:**
```bash
cd d:\project_lend\backend
git add .
git commit -m "Update backend"
git push
```
Railway auto-deploys on push.

**Frontend:**
```bash
cd d:\project_lend\frontend
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push.

---

## 🆓 Free Tier Limits

**Railway:**
- $5 free credit/month
- ~500 hours runtime

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments

**Ethereum Sepolia:**
- Free testnet (gas fees paid with test ETH)

---

## 🛠️ Troubleshooting

**Backend not responding:**
- Check Railway logs
- Verify environment variables
- Check if service is sleeping (Railway may sleep inactive apps)

**Frontend API errors:**
- Verify `NEXT_PUBLIC_API_BASE_URL` points to Railway URL
- Check CORS settings in backend
- Verify backend is running

**Wallet connection issues:**
- Ensure you're on Ethereum Sepolia network
- Check contract addresses in frontend .env

---

## 📱 Production Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Smart contracts verified on Etherscan
- [ ] Test wallet connection
- [ ] Test minting NFT
- [ ] Test renting subscription
- [ ] Update domain (optional)

---

## 🎉 You're Live!

Share your app: https://your-app.vercel.app

Need help? Check Railway/Vercel documentation or contact support.
