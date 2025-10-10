# 🔗 Blockchain Integration Guide

## ✅ Real Wallet & Testnet Integration Complete!

Your SubLendX platform now uses **real Coinbase Smart Wallet** on **Base Sepolia testnet** instead of demo wallets!

---

## 🎯 What Changed

### **Before (Demo Mode):**
- ❌ Mock wallet connections
- ❌ Simulated transactions
- ❌ In-memory only data
- ❌ No real blockchain

### **After (Real Blockchain):**
- ✅ **Real Coinbase Wallet** connection
- ✅ **Base Sepolia testnet** transactions
- ✅ **NFT minting** on-chain (AccessNFT contract)
- ✅ **USDC payments** (testnet USDC)
- ✅ **Smart contract escrow** (RentalEscrow contract)
- ✅ **Wallet linked to user accounts**
- ✅ **Transaction hashes** on BaseScan

---

## 🚀 Features Implemented

### **1. Wallet Connection with Authentication**
- Users must **login/signup** before connecting wallet
- Wallet address linked to email account
- Secure JWT-based account system
- Modal guides users through the process

### **2. NFT Minting for Listings**
- Each listing = 1 NFT minted on Base Sepolia
- NFT contains subscription metadata
- Price stored on-chain
- Owner controls the NFT

### **3. Smart Contract Integration**
- **AccessNFT.sol**: ERC721 NFTs for subscriptions
- **RentalEscrow.sol**: Secure USDC payments
- **MockUSDC**: Testnet USDC (6 decimals)

### **4. On-Chain Rental Flow**
- Borrower approves USDC spending
- Create rental via RentalEscrow contract
- Funds held in escrow
- Access granted via NFT.setUser()
- Payment released after duration

---

## 📋 Complete User Flow

### **Step 1: Create Account**
```
1. Go to /signup
2. Enter name, email, password
3. Account created with JWT token
4. Stored in localStorage
```

### **Step 2: Connect Wallet**
```
1. Click "Connect Wallet" in navbar
2. Modal checks: Are you logged in?
   - NO → Shows "Login Required" screen
   - YES → Shows "Connect Wallet" button
3. Click "Connect Coinbase Wallet"
4. Coinbase Wallet popup appears
5. Approve connection
6. Wallet linked to your email account
7. Navbar shows: [Your Name] | [0x1234...5678]
```

### **Step 3: List a Subscription (Mint NFT)**
```
1. Go to "My Subscriptions" → "Lending" tab
2. Click "List Subscription"
3. Fill form:
   - Name: Netflix
   - Description: HD account
   - Price: $5/hour
   - Max Duration: 24h
   - Category: Streaming
4. Click "List Subscription on Blockchain"
5. Process:
   📝 Preparing metadata...
   ⛓️  Minting NFT on Base Sepolia...
   💳 Coinbase Wallet: Confirm transaction
   ⏳ Waiting for confirmation...
   ✅ NFT minted! Token ID: 123
   💾 Creating listing in backend...
   ✅ Subscription listed successfully!
6. View on BaseScan: https://sepolia.basescan.org/tx/0x...
```

### **Step 4: Rent a Subscription**
```
1. Browse marketplace
2. Find a subscription
3. Click "Rent Now"
4. Select duration
5. Approve USDC spending
6. Create rental transaction
7. Access granted via NFT
8. Start using subscription!
```

---

## 🏗️ Technical Architecture

### **Smart Contracts (Base Sepolia)**

```
AccessNFT (0xf24dC6ACD62D859aF1047c2B7F1aB5bf3f2A0f7D)
├── mintNFT() - Create subscription NFT
├── setUser() - Grant temporary access
├── revokeUser() - Remove access
├── userOf() - Check current borrower
└── userExpires() - Check expiration time

RentalEscrow (0x4Ca5f9F6BEbBF076302Ba354010F0e26982E1a62)
├── createRental() - Start rental & hold USDC
├── releasePayment() - Pay lender after duration
├── cancelRental() - Cancel & refund
└── checkRentalExpiry() - Check if rental ended

MockUSDC (Base Sepolia USDC)
├── approve() - Allow escrow to spend
├── transfer() - Send USDC
├── balanceOf() - Check balance
└── mint() - Get test USDC (for testing)
```

### **Frontend Utils**

```typescript
// contracts.ts
- ACCESS_NFT_ABI: Contract interface
- RENTAL_ESCROW_ABI: Escrow interface
- MOCK_USDC_ABI: USDC interface
- getAccessNFTContract(): Get contract instance
- getRentalEscrowContract(): Get escrow instance
- pricePerHourToWei(): Convert price to blockchain format

// blockchain.ts
- mintSubscriptionNFT(): Mint NFT for listing
- createRental(): Rent a subscription
- getNFTDetails(): Get NFT info
- checkUserAccess(): Verify access rights
- cancelRental(): Cancel active rental

// wallet.ts
- connectWallet(): Connect Coinbase Wallet
- disconnectWallet(): Disconnect wallet
- initializeWallet(): Initialize wallet SDK
```

### **Components**

```typescript
// WalletConnectModal.tsx
- Requires login before wallet connection
- Shows user email & avatar
- Guides through connection process
- Links wallet to account via API
- Handles network switching (Base Sepolia)

// ListSubscriptionModal.tsx
- Validates user is logged in
- Mints NFT on blockchain
- Shows minting progress
- Stores listing with NFT token ID
- Displays transaction hash
```

---

## 🧪 Testing on Base Sepolia

### **Prerequisites:**

1. **Coinbase Wallet installed**
   - Browser extension or mobile app
   - https://www.coinbase.com/wallet

2. **Test ETH for gas fees**
   - Base Sepolia Faucet: https://www.alchemy.com/faucets/base-sepolia
   - Or: https://faucet.quicknode.com/base/sepolia

3. **Test USDC (optional)**
   - Get from faucet or mint via contract

### **Test Flow:**

#### **1. Setup Wallet**
```bash
1. Install Coinbase Wallet
2. Create new wallet or import existing
3. Switch network to "Base Sepolia"
4. Get test ETH from faucet (need ~0.01 ETH)
```

#### **2. Create Account & Connect**
```bash
1. Start frontend: npm run dev
2. Go to http://localhost:3000
3. Click "Sign Up"
4. Create account: test@test.com / Test1234!
5. Click "Connect Wallet"
6. Approve in Coinbase Wallet
7. ✅ Connected!
```

#### **3. List Subscription (Mint NFT)**
```bash
1. Go to "My Subscriptions"
2. Click "List Subscription"
3. Fill form:
   - Name: Netflix
   - Price: $5/hour
   - Duration: 24h
4. Click "List Subscription on Blockchain"
5. ⚠️ Coinbase Wallet popup appears
6. Review gas fees (~0.001 ETH)
7. Click "Confirm"
8. ⏳ Wait for confirmation (~5-10 seconds)
9. ✅ NFT minted! You'll see Token ID
10. Check BaseScan: https://sepolia.basescan.org
```

#### **4. Verify NFT**
```bash
1. Go to BaseScan: https://sepolia.basescan.org
2. Search your wallet address
3. Click "Tokens" → "ERC-721"
4. You should see "SubLendX Access NFT"
5. Click to view token details
```

---

## 🔍 Debugging

### **Check Wallet Connection:**
```javascript
// In browser console:
localStorage.getItem('walletAddress')
// Should return: "0x..."
```

### **Check User Account:**
```javascript
localStorage.getItem('userEmail')
localStorage.getItem('authToken')
// Should return your email and JWT token
```

### **Check Network:**
```javascript
// Wallet should be on Base Sepolia
// Chain ID: 84532 (0x14a34)
```

### **View Transaction:**
```bash
# After minting, you'll see transaction hash
# Copy and paste into BaseScan:
https://sepolia.basescan.org/tx/YOUR_TX_HASH
```

### **Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "user rejected transaction" | Cancelled in wallet | Try again, click Confirm |
| "insufficient funds" | Not enough ETH | Get test ETH from faucet |
| "wrong network" | Not on Base Sepolia | Switch to Base Sepolia in wallet |
| "Please login first" | No account | Create account at /signup |
| "wallet not connected" | No wallet linked | Connect wallet first |

---

## 📊 Data Flow

### **Minting NFT Flow:**
```
User fills form
  ↓
Check authentication (JWT)
  ↓
Check wallet connection
  ↓
Prepare metadata JSON
  ↓
Call mintSubscriptionNFT()
  ↓
Connect to wallet (ethers.js)
  ↓
Check network (switch if needed)
  ↓
Get AccessNFT contract instance
  ↓
Call contract.mintNFT()
  ↓
User confirms in Coinbase Wallet
  ↓
Transaction sent to blockchain
  ↓
Wait for confirmation
  ↓
Extract token ID from event
  ↓
Store listing in backend with token ID
  ↓
Success!
```

---

## 🔐 Security Features

### **Account Security:**
- Email/password authentication
- JWT tokens (7-day expiration)
- Password hashing (bcrypt)
- Wallet linked to verified account

### **Blockchain Security:**
- ERC-721 standard NFTs
- ReentrancyGuard on contracts
- Ownable pattern
- USDC held in escrow
- Time-based access control

### **Frontend Security:**
- Wallet signature verification
- Network validation
- Transaction confirmation
- Error handling
- User consent required

---

## 🎯 Network Configuration

### **Base Sepolia Testnet:**
```
Network Name: Base Sepolia
RPC URL: https://base-sepolia.infura.io/v3/...
Chain ID: 84532 (0x14a34)
Currency: ETH
Block Explorer: https://sepolia.basescan.org
```

### **Contract Addresses:**
```
AccessNFT: 0xf24dC6ACD62D859aF1047c2B7F1aB5bf3f2A0f7D
RentalEscrow: 0x4Ca5f9F6BEbBF076302Ba354010F0e26982E1a62
```

---

## 📈 Future Enhancements

### **Phase 2: Mainnet Deployment**
- Deploy to Base mainnet
- Use real USDC
- Production monitoring
- Gas optimization

### **Phase 3: Advanced Features**
- Chainlink Price Feeds for dynamic pricing
- Chainlink Automation for automatic payment release
- NFT metadata on IPFS
- Batch minting
- Fractional ownership

### **Phase 4: Multi-Chain**
- Support Ethereum mainnet
- Support Polygon
- Cross-chain bridge
- Multi-token payments

---

## ✅ Summary

**Your SubLendX platform now has:**
- ✅ Real Coinbase Wallet integration
- ✅ Base Sepolia testnet transactions
- ✅ NFT minting for subscriptions
- ✅ Smart contract escrow
- ✅ On-chain access control
- ✅ Account + wallet linking
- ✅ Transaction verification on BaseScan

**No more demo mode!** Everything is real blockchain now! 🎉

---

## 🚀 Quick Start Commands

```bash
# 1. Start backend
cd d:\project_lend\backend
node server.js

# 2. Start frontend
cd d:\project_lend\frontend
npm run dev

# 3. Open app
http://localhost:3000

# 4. Create account → Connect wallet → List subscription!
```

**Get test ETH:** https://www.alchemy.com/faucets/base-sepolia  
**View transactions:** https://sepolia.basescan.org

---

**Last Updated:** 2025-10-10  
**Network:** Base Sepolia Testnet  
**Status:** ✅ Production-Ready (Testnet)
