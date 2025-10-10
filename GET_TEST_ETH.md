# 🚰 Get Test ETH for Base Sepolia

## Your Deployment Wallet
**Address:** `0xC13aE61A7351e435A515f153cf6997a6B79fC738`
**Current Balance:** 0 ETH
**Network:** Base Sepolia Testnet

---

## 💰 Get Free Test ETH (Choose Any Method)

### **Method 1: Alchemy Faucet** ⭐ RECOMMENDED
1. Go to: https://www.alchemy.com/faucets/base-sepolia
2. Sign in with Google/GitHub
3. Enter wallet address: `0xC13aE61A7351e435A515f153cf6997a6B79fC738`
4. Complete CAPTCHA
5. Click "Send Me ETH"
6. ✅ You'll receive **0.1 test ETH** (enough for ~30 deployments)

### **Method 2: QuickNode Faucet**
1. Go to: https://faucet.quicknode.com/base/sepolia
2. Connect Twitter account (required)
3. Enter wallet address: `0xC13aE61A7351e435A515f153cf6997a6B79fC738`
4. Click "Continue"
5. ✅ You'll receive test ETH

### **Method 3: Coinbase Wallet Faucet**
1. Go to: https://portal.cdp.coinbase.com/products/faucet
2. Sign in with Coinbase account
3. Select "Base Sepolia"
4. Enter wallet address: `0xC13aE61A7351e435A515f153cf6997a6B79fC738`
5. ✅ Request test ETH

### **Method 4: Base Discord Faucet**
1. Join Base Discord: https://discord.gg/buildonbase
2. Go to #faucet channel
3. Type: `/faucet 0xC13aE61A7351e435A515f153cf6997a6B79fC738`
4. ✅ Bot sends test ETH

---

## ✅ Verify Balance

After getting test ETH, check your balance:

**Option 1: BaseScan**
```
https://sepolia.basescan.org/address/0xC13aE61A7351e435A515f153cf6997a6B79fC738
```

**Option 2: Hardhat Console**
```bash
cd d:\project_lend\smart-contracts
npx hardhat console --network baseSepolia

# In console:
const balance = await ethers.provider.getBalance("0xC13aE61A7351e435A515f153cf6997a6B79fC738");
console.log("Balance:", ethers.formatEther(balance), "ETH");
```

---

## 🚀 After Getting Test ETH

Once you have test ETH (balance > 0.01 ETH), run deployment again:

```bash
cd d:\project_lend\smart-contracts
npx hardhat run scripts/deploy.js --network baseSepolia
```

Expected success output:
```
Deploying contracts with the account: 0xC13aE61A7351e435A515f153cf6997a6B79fC738
Account balance: 100000000000000000  ← Should be > 0

📝 Deploying AccessNFT...
✅ AccessNFT deployed to: 0x...

📝 Deploying RentalEscrow...
✅ RentalEscrow deployed to: 0x...

✅ DEPLOYMENT COMPLETE!
```

---

## 📊 Gas Cost Estimate

**Deployment costs:**
- AccessNFT: ~0.002 ETH
- RentalEscrow: ~0.003 ETH
- Total: ~0.005 ETH

**Recommended balance:** 0.01 ETH (gives you buffer for multiple deployments)

---

## 🔧 Troubleshooting

### **Faucet says "Already claimed"**
- Wait 24 hours, or
- Try a different faucet, or
- Use a different wallet and transfer ETH

### **Faucet requires verification**
- Some faucets need Twitter/GitHub account
- This prevents abuse

### **Still 0 balance after claiming**
- Check transaction on BaseScan
- Wait 1-2 minutes for confirmation
- Try different faucet

---

## ⚡ Quick Start

**Fastest way to get test ETH:**
1. Go to: https://www.alchemy.com/faucets/base-sepolia
2. Paste: `0xC13aE61A7351e435A515f153cf6997a6B79fC738`
3. Get 0.1 ETH instantly
4. Run deployment!

---

**Once you have test ETH, your deployment will work!** 🎉
