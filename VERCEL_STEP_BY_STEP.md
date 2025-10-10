# 🚀 Deploy SubLendX to Vercel - Complete Guide

## 📋 What You'll Deploy

```
┌─────────────────────────────────────────────────────┐
│                    YOUR APP                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  VERCEL (Everything)                                │
│  ├─ Backend API                                     │
│  │  └─ https://sublendx-backend.vercel.app         │
│  │                                                   │
│  └─ Frontend Web App                                │
│     └─ https://sublendx.vercel.app                  │
│                                                      │
│  ETHEREUM SEPOLIA (Already Deployed ✅)             │
│  ├─ AccessNFT: 0xF23e...250e                       │
│  └─ RentalEscrow: 0x9695...AA91                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## ⏱️ Time Required: 30 Minutes

- Backend deployment: 15 minutes
- Frontend deployment: 10 minutes
- Testing: 5 minutes

---

## 📦 Prerequisites

Before starting, make sure you have:

- [ ] GitHub account (create at github.com)
- [ ] Git installed (run `git --version` to check)
- [ ] Your project at `d:\project_lend`
- [ ] Internet connection

---

# 🔷 PART 1: DEPLOY BACKEND (15 MINUTES)

---

## Step 1.1: Check Git Installation (2 minutes)

Open **PowerShell** and check:

```powershell
git --version
```

**Expected Output:**
```
git version 2.x.x
```

**If NOT installed:**
1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. Restart PowerShell
4. Run `git --version` again

---

## Step 1.2: Configure Git (First Time Only) (1 minute)

If this is your first time using Git:

```powershell
# Set your name (use your real name)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify
git config --global --list
```

**Expected Output:**
```
user.name=Your Name
user.email=your.email@example.com
```

---

## Step 1.3: Create GitHub Account (2 minutes)

**Skip if you already have one!**

1. Go to https://github.com
2. Click **"Sign up"**
3. Enter email, password, username
4. Verify email
5. Complete setup

---

## Step 1.4: Create Backend GitHub Repository (3 minutes)

### **A. On GitHub Website:**

1. **Login to GitHub** (github.com)

2. **Click the "+" icon** (top right) → **"New repository"**

3. **Fill in details:**
   ```
   Repository name: sublendx-backend
   Description: SubLendX Backend API
   Visibility: Public ✅ (important!)
   ✅ DO NOT initialize with README
   ✅ DO NOT add .gitignore
   ✅ DO NOT choose a license
   ```

4. **Click "Create repository"** (green button)

5. **You'll see a page with instructions** - KEEP THIS PAGE OPEN!

   It will show something like:
   ```
   …or create a new repository on the command line
   
   git init
   git add README.md
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sublendx-backend.git
   git push -u origin main
   ```

   **Copy the URL from this page!** It looks like:
   ```
   https://github.com/YOUR_USERNAME/sublendx-backend.git
   ```

---

## Step 1.5: Push Backend Code to GitHub (3 minutes)

### **Open PowerShell in Backend Folder:**

**Option A: Using File Explorer**
1. Open File Explorer
2. Navigate to `d:\project_lend\backend`
3. Click in the address bar
4. Type `powershell` and press Enter

**Option B: Using PowerShell**
```powershell
cd d:\project_lend\backend
```

### **Initialize Git Repository:**

```powershell
# Step 1: Initialize Git (creates .git folder)
git init
```

**Expected Output:**
```
Initialized empty Git repository in d:/project_lend/backend/.git/
```

### **Add All Files:**

```powershell
# Step 2: Stage all files for commit
git add .
```

**This adds all files to Git tracking**

### **Create First Commit:**

```powershell
# Step 3: Create a snapshot (commit)
git commit -m "Initial backend deployment"
```

**Expected Output:**
```
[main (root-commit) abc1234] Initial backend deployment
 XX files changed, XXX insertions(+)
 create mode 100644 server.js
 create mode 100644 package.json
 ...
```

### **Connect to GitHub:**

```powershell
# Step 4: Link local repo to GitHub
# REPLACE YOUR_USERNAME with your actual GitHub username!
git remote add origin https://github.com/YOUR_USERNAME/sublendx-backend.git
```

**Example:**
```powershell
git remote add origin https://github.com/johnsmith/sublendx-backend.git
```

### **Set Main Branch:**

```powershell
# Step 5: Rename branch to 'main'
git branch -M main
```

### **Push to GitHub:**

```powershell
# Step 6: Upload code to GitHub
git push -u origin main
```

**What happens:**
1. Git connects to GitHub
2. **Might ask for credentials:**
   - **On Windows**: GitHub credential manager pops up
   - Enter your GitHub username
   - Enter your **Personal Access Token** (not password!)

**If it asks for password, you need a Personal Access Token:**

#### How to Create GitHub Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `Vercel Deployment`
4. Expiration: `90 days` (or longer)
5. Select scopes:
   - ✅ `repo` (all sub-options)
   - ✅ `workflow`
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as your password when pushing

**Expected Output After Push:**
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to 8 threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XX.XX KiB | XX.XX MiB/s, done.
Total XX (delta X), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/sublendx-backend.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### **Verify on GitHub:**

1. Go to your GitHub repository page
2. Refresh the page
3. **You should see all your backend files!** ✅
   - server.js
   - package.json
   - routes/
   - etc.

---

## Step 1.6: Create Vercel Account (2 minutes)

1. **Go to https://vercel.com**

2. **Click "Sign Up"**

3. **Choose "Continue with GitHub"** (easiest option)

4. **Authorize Vercel** on GitHub
   - Click "Authorize Vercel"
   - Grant access to repositories

5. **Complete setup**
   - Choose a team name (or use default)
   - Skip team invites

**You're now in Vercel dashboard!** 🎉

---

## Step 1.7: Deploy Backend on Vercel (4 minutes)

### **A. Import Project:**

1. **In Vercel Dashboard**, click **"Add New..."** (top right)

2. Select **"Project"**

3. **You'll see "Import Git Repository" page**

4. **Find your `sublendx-backend` repository**
   - If you don't see it, click **"Adjust GitHub App Permissions"**
   - Grant access to the repository
   - Come back and click **"Import"**

### **B. Configure Project:**

**Vercel shows configuration page:**

#### **Framework Preset:**
```
Other (leave as default)
```
Vercel auto-detects it's a Node.js app

#### **Root Directory:**
```
./ (leave as default)
```

#### **Build Command:**
```
(leave empty - not needed for serverless)
```

#### **Output Directory:**
```
(leave empty)
```

#### **Install Command:**
```
npm install (auto-filled)
```

### **C. Add Environment Variables:**

**IMPORTANT: Click "Environment Variables" section**

Add these **EXACTLY** (one at a time):

**Variable 1:**
```
Key:   PORT
Value: 3002
```

**Variable 2:**
```
Key:   SUPABASE_URL
Value: https://doqslzidmmkdnaqqqwlo.supabase.co
```

**Variable 3:**
```
Key:   SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcXNsemlkbW1rZG5hcXFxd2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDc4MTAsImV4cCI6MjA3NTQyMzgxMH0.MIb7oihOqKklBi2WnnRXQoj4DG_t-E73FfQN4ly7uuA
```

**Variable 4:**
```
Key:   JWT_SECRET
Value: sublendx-secret-key-2024-change-in-production
```

**Variable 5:**
```
Key:   BASE_SEPOLIA_RPC
Value: https://ethereum-sepolia-rpc.publicnode.com
```

**Variable 6:**
```
Key:   ACCESS_NFT_ADDRESS
Value: 0xF23e4962354b4e135ab540400a10e4F7cB6F250e
```

**Variable 7:**
```
Key:   RENTAL_ESCROW_ADDRESS
Value: 0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

**Variable 8:**
```
Key:   NODE_ENV
Value: production
```

**Total: 8 environment variables**

### **D. Deploy:**

1. **Click "Deploy"** (big button at bottom)

2. **Vercel starts building:**
   ```
   Queued...
   Building...
   ```

3. **Watch the build logs** (optional but cool to see)
   - Installing dependencies
   - Creating serverless functions
   - Deploying to edge network

4. **Wait 2-3 minutes** ⏳

5. **You'll see: "Congratulations! Your project is live!"** 🎉

---

## Step 1.8: Get Backend URL (1 minute)

### **After successful deployment:**

1. **Vercel shows your deployment page**

2. **Click "Visit"** or copy the URL

3. **Your backend URL looks like:**
   ```
   https://sublendx-backend.vercel.app
   ```
   OR
   ```
   https://sublendx-backend-USERNAME.vercel.app
   ```

4. **COPY THIS URL!** You'll need it for the frontend.

### **Test Your Backend:**

Open your browser and go to:
```
https://YOUR-BACKEND-URL.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "SubLendX Backend is running"
}
```

**If you see this, your backend is LIVE!** ✅

### **Test API Endpoints:**

```
https://YOUR-BACKEND-URL.vercel.app/api/rent/listings
```

**Expected Response:**
```json
[]
```
(Empty array because no listings yet - this is correct!)

---

# 🔶 PART 2: DEPLOY FRONTEND (10 MINUTES)

---

## Step 2.1: Update Frontend Environment Variables (2 minutes)

**IMPORTANT: Update frontend to use your deployed backend!**

### **Edit Frontend .env File:**

1. **Open:** `d:\project_lend\frontend\.env`

2. **Replace entire content with:**

```env
# API Configuration - YOUR DEPLOYED BACKEND URL
NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND-URL.vercel.app/api

# Ethereum Sepolia Network Configuration
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com

# Contract Addresses (Ethereum Sepolia Testnet)
NEXT_PUBLIC_ACCESS_NFT_ADDRESS=0xF23e4962354b4e135ab540400a10e4F7cB6F250e
NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

3. **REPLACE `YOUR-BACKEND-URL` with your actual backend URL!**

   **Example:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://sublendx-backend.vercel.app/api
   ```

4. **Save the file** (Ctrl+S)

---

## Step 2.2: Create Frontend GitHub Repository (2 minutes)

### **On GitHub:**

1. **Go to https://github.com**

2. **Click "+" → "New repository"**

3. **Fill in:**
   ```
   Repository name: sublendx-frontend
   Description: SubLendX Frontend - Web3 Subscription Marketplace
   Visibility: Public ✅
   ✅ DO NOT initialize with README
   ```

4. **Click "Create repository"**

5. **Copy the repository URL:**
   ```
   https://github.com/YOUR_USERNAME/sublendx-frontend.git
   ```

---

## Step 2.3: Push Frontend Code to GitHub (2 minutes)

### **Open PowerShell in Frontend Folder:**

```powershell
cd d:\project_lend\frontend
```

### **Git Commands:**

```powershell
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial frontend deployment"

# Connect to GitHub (REPLACE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/sublendx-frontend.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Enter GitHub credentials if asked** (use Personal Access Token as password)

### **Verify:**
Go to your GitHub repository and see all frontend files! ✅

---

## Step 2.4: Deploy Frontend on Vercel (4 minutes)

### **A. Import Project:**

1. **In Vercel Dashboard**, click **"Add New..." → "Project"**

2. **Find `sublendx-frontend`** repository

3. **Click "Import"**

### **B. Configure Project:**

**Framework Preset:**
```
Next.js (should be auto-detected) ✅
```

**Root Directory:**
```
./ (default)
```

**Build Command:**
```
npm run build (auto-filled)
```

**Output Directory:**
```
.next (auto-filled)
```

**Install Command:**
```
npm install (auto-filled)
```

### **C. Add Environment Variables:**

**Click "Environment Variables"**

Add these 4 variables:

**Variable 1:**
```
Key:   NEXT_PUBLIC_API_BASE_URL
Value: https://YOUR-BACKEND-URL.vercel.app/api
```
(Use YOUR actual backend URL!)

**Variable 2:**
```
Key:   NEXT_PUBLIC_BASE_SEPOLIA_RPC
Value: https://ethereum-sepolia-rpc.publicnode.com
```

**Variable 3:**
```
Key:   NEXT_PUBLIC_ACCESS_NFT_ADDRESS
Value: 0xF23e4962354b4e135ab540400a10e4F7cB6F250e
```

**Variable 4:**
```
Key:   NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS
Value: 0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

**Total: 4 environment variables**

### **D. Deploy:**

1. **Click "Deploy"**

2. **Wait 3-5 minutes** ⏳
   - Vercel builds your Next.js app
   - Optimizes images
   - Creates static pages
   - Deploys to global CDN

3. **Success! 🎉**

---

## Step 2.5: Get Frontend URL (1 minute)

### **Your Live App URL:**

```
https://sublendx.vercel.app
```
OR
```
https://sublendx-USERNAME.vercel.app
```

**Click "Visit" to see your live app!**

---

# 🎉 PART 3: TEST YOUR DEPLOYED APP (5 MINUTES)

---

## Step 3.1: Open Your Live App

**Go to your frontend URL:**
```
https://your-app-name.vercel.app
```

**You should see:**
- SubLendX homepage
- Navbar with "Connect Wallet"
- Clean, professional UI

✅ **Frontend is live!**

---

## Step 3.2: Test Wallet Connection (1 minute)

1. **Click "Connect Wallet"**

2. **Choose Coinbase Wallet or MetaMask**

3. **Connect your wallet**

4. **Switch to Ethereum Sepolia network** (if prompted)

5. **Wallet address should appear** in navbar

✅ **Wallet connected!**

---

## Step 3.3: Test Listing a Subscription (2 minutes)

1. **Go to "My Subscriptions"** (navbar)

2. **Click "List Subscription"**

3. **Fill in the form:**
   ```
   Name: Netflix Premium
   Description: Full HD streaming access
   Price per Hour: 2
   Max Duration: 24
   Category: Streaming
   ```

4. **Click "Submit"**

5. **Confirm transaction in wallet**
   - Approve transaction
   - Wait for confirmation ⏳

6. **Success!** You should see:
   ```
   ✅ Subscription listed successfully!
   ```

---

## Step 3.4: Test Marketplace (1 minute)

1. **Go to "Marketplace"** (navbar)

2. **You should see your Netflix subscription!**
   ```
   Netflix Premium
   $2 per hour
   NFT #X
   Lender: 0xYour...Address
   ```

3. **Click on it** to view details

✅ **Marketplace works!**

---

## Step 3.5: Test Renting (Optional - 2 minutes)

**You can test renting from another wallet:**

1. **Open app in incognito window** OR **another browser**

2. **Connect different wallet**

3. **Go to Marketplace**

4. **Click "Rent Now" on Netflix**

5. **Select duration** (e.g., 2 hours)

6. **Confirm rental transaction**

7. **Success!** 🎉

---

# ✅ DEPLOYMENT COMPLETE!

---

## 🎯 Your Live URLs

**Frontend (Main App):**
```
https://your-app-name.vercel.app
```

**Backend (API):**
```
https://your-backend.vercel.app
```

**Smart Contracts (Already Deployed):**
```
Ethereum Sepolia:
- AccessNFT: 0xF23e4962354b4e135ab540400a10e4F7cB6F250e
- RentalEscrow: 0x9695Fcb1705345116Aa2C3A0d20D78D300AbAA91
```

---

## 📊 What You Just Did

```
✅ Created 2 GitHub repositories
✅ Pushed code to GitHub
✅ Deployed backend to Vercel (serverless functions)
✅ Deployed frontend to Vercel (global CDN)
✅ Configured environment variables
✅ Tested wallet connection
✅ Tested listing subscriptions
✅ Tested marketplace
✅ Your app is LIVE on the internet! 🌍
```

---

## 🔄 How to Update Your Deployed App

### **Update Backend:**

```powershell
cd d:\project_lend\backend

# Make your changes to files

# Commit and push
git add .
git commit -m "Updated backend"
git push
```

**Vercel auto-deploys in ~2 minutes!** ⚡

---

### **Update Frontend:**

```powershell
cd d:\project_lend\frontend

# Make your changes

# Commit and push
git add .
git commit -m "Updated frontend"
git push
```

**Vercel auto-deploys in ~3 minutes!** ⚡

---

## 🌐 Share Your App

**Your app is now publicly accessible!**

Share these links:
- **Main App:** https://your-app.vercel.app
- **GitHub (Frontend):** https://github.com/YOUR_USERNAME/sublendx-frontend
- **GitHub (Backend):** https://github.com/YOUR_USERNAME/sublendx-backend

**Add to your:**
- Portfolio
- Resume
- LinkedIn
- Twitter

---

## 🎓 What You Learned

1. ✅ **Git & GitHub** - Version control and code hosting
2. ✅ **Vercel Deployment** - Serverless hosting
3. ✅ **Environment Variables** - Secure configuration
4. ✅ **CI/CD** - Continuous deployment
5. ✅ **Full-Stack Deployment** - Frontend + Backend
6. ✅ **Web3 Deployment** - Blockchain integration

---

## 💰 Cost: $0

**Everything is FREE:**
- ✅ GitHub: Free forever
- ✅ Vercel: Free tier (100GB/month)
- ✅ Ethereum Sepolia: Free testnet

**No credit card required!** 💳❌

---

## 🛠️ Troubleshooting

### **Problem 1: Git push fails**

**Error:**
```
Permission denied (publickey)
```

**Solution:**
Use HTTPS (not SSH):
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/repo-name.git
```

---

### **Problem 2: Vercel build fails**

**Check:**
1. Build logs in Vercel dashboard
2. Environment variables are set?
3. package.json has correct scripts?

**Solution:**
View logs → Fix error → Push again (auto-redeploys)

---

### **Problem 3: Frontend can't reach backend**

**Check:**
1. Backend URL in frontend env vars is correct?
2. Backend is deployed and running?
3. Test backend health: `https://backend-url/health`

**Solution:**
Update `NEXT_PUBLIC_API_BASE_URL` in Vercel dashboard:
- Go to Project Settings
- Environment Variables
- Edit the value
- Redeploy

---

### **Problem 4: Wallet won't connect**

**Check:**
1. On Ethereum Sepolia network?
2. Contract addresses correct?
3. Have test ETH?

**Solution:**
Get test ETH from faucet:
- https://sepoliafaucet.com
- https://www.alchemy.com/faucets/ethereum-sepolia

---

### **Problem 5: Cold start delay**

**This is normal!**
- First request: 1-3 seconds
- Next requests: Fast

**This is how serverless works. Totally fine!** ✅

---

## 📱 Vercel Dashboard Tips

### **View Logs:**
1. Go to Vercel project
2. Click "Deployments"
3. Click on a deployment
4. See build logs and runtime logs

### **Custom Domain (Optional):**
1. Go to Project Settings
2. Domains
3. Add your custom domain
4. Follow DNS instructions

### **Analytics:**
1. Go to Analytics tab
2. See traffic, performance, etc.

### **Rollback Deployment:**
1. Go to Deployments
2. Find previous deployment
3. Click "..." → "Promote to Production"

---

## 🎉 Congratulations!

**You successfully deployed a full-stack Web3 application!**

**Your tech stack:**
- ✅ React/Next.js (Frontend)
- ✅ Node.js/Express (Backend)
- ✅ Ethereum/Solidity (Smart Contracts)
- ✅ Vercel (Hosting)
- ✅ GitHub (Version Control)

**This is a production-ready application!** 🚀

---

## 📚 Next Steps

**Enhance your app:**
1. Add more features
2. Improve UI/UX
3. Add more blockchain networks
4. Implement real USDC payments
5. Add user profiles
6. Add email notifications

**Learn more:**
- Vercel docs: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
- Web3: https://ethereum.org/developers

---

## 💬 Need Help?

**Common resources:**
- Vercel Discord: https://vercel.com/discord
- GitHub Discussions: Enable in your repo
- Stack Overflow: Tag with `vercel` and `nextjs`

---

## 🎓 Certificate of Completion

```
╔═══════════════════════════════════════════════════════╗
║                                                        ║
║  🎉 CONGRATULATIONS! 🎉                               ║
║                                                        ║
║  You have successfully deployed SubLendX              ║
║  A full-stack Web3 application                        ║
║                                                        ║
║  ✅ Frontend Deployment                               ║
║  ✅ Backend Deployment                                ║
║  ✅ Smart Contract Integration                        ║
║  ✅ Production Ready                                  ║
║                                                        ║
║  Date: October 10, 2025                               ║
║                                                        ║
╚═══════════════════════════════════════════════════════╝
```

---

**You're now a full-stack Web3 developer! Keep building! 🚀**
