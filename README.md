# SubLendX

SubLendX is a decentralized platform that allows users to lend and rent unused portions of their digital subscriptions using ERC-4907 NFTs and stablecoin (USDC) micropayments on the Base blockchain via the x402 HTTP Payment Required protocol.

## Project Structure

```
project_lend/
├── smart-contracts/     # Solidity smart contracts
├── backend/             # Node.js Express server
├── frontend/            # Next.js web application
└── README.md           # This file
```

## Features

- **ERC-4907 Time-Bound NFTs**: Represent digital subscriptions as time-bound NFTs
- **USDC Micropayments**: Rent subscriptions using stablecoin payments
- **x402 Protocol**: HTTP payment required protocol for access control
- **Decentralized**: Built on Base blockchain for security and transparency
- **Wallet Integration**: Coinbase Wallet SDK for easy wallet connection

## Modules

### Smart Contracts (Solidity)

- **AccessNFT.sol**: ERC-4907 time-bound NFT for subscription rentals
  - Mint NFT representing subscription access
  - Assign borrower for specific duration
  - Auto-revoke on expiry
  - Emits events for Minted, Borrowed, Revoked

- **RentalEscrow.sol**: Escrow and payment logic for rental transactions using USDC
  - createRental: lock payment and NFT
  - releasePayment: send funds after expiry
  - cancelRental: refund borrower if canceled early
  - Chainlink Automation integration for expiry checks

### Backend (Node.js/Express)

- REST API for listings, rentals, and x402 payments
- Supabase integration for data storage
- IPFS integration via Pinata for metadata storage
- Ethereum blockchain interaction via ethers.js

### Frontend (Next.js/React)

- Wallet connection via Coinbase Wallet SDK
- Subscription listing and browsing
- Rental interface with duration selection
- Responsive UI with Tailwind CSS

## Setup Guide

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Ethereum wallet (Coinbase Wallet recommended)
- Base Sepolia testnet ETH and USDC

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project_lend
```

### 2. Smart Contracts Setup

```bash
cd smart-contracts
npm install
```

Create a `.env` file based on `.env.example` and add your private key and RPC endpoint.

Deploy contracts to Base Sepolia:
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example` and add your configuration.

Start the server:
```bash
node server.js
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file with your configuration.

Start the development server:
```bash
npm run dev
```

## Testing

### Smart Contracts

```bash
cd smart-contracts
npx hardhat test
```

### Frontend

```bash
cd frontend
npm run test
```

## Deployment

### Smart Contracts

Deploy to Base Sepolia:
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

### Frontend

Deploy to Vercel:
1. Push code to GitHub
2. Connect Vercel to your repository
3. Configure environment variables
4. Deploy

## Future Scope

- DAO-based governance for pricing and disputes
- Multi-stablecoin support (DAI, USDT)
- Integration with SaaS APIs (ChatGPT, Canva, Midjourney)
- On-chain reputation and token rewards

## Security

- Use SafeERC20 for USDC transactions
- Apply ReentrancyGuard
- Validate all external calls
- Restrict owner functions
- Write unit tests for edge cases

## License

MIT