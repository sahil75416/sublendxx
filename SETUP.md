# SubLendX Setup Instructions

## Overview

SubLendX is a decentralized platform that allows users to lend and rent unused portions of their digital subscriptions using ERC-4907 NFTs and stablecoin (USDC) micropayments on the Base blockchain via the x402 HTTP Payment Required protocol.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

You'll also need:
- An Ethereum wallet (Coinbase Wallet recommended)
- Base Sepolia testnet ETH and USDC (get from faucet)

## Project Structure

The project consists of three main modules:
1. **smart-contracts**: Solidity smart contracts for NFTs and rental logic
2. **backend**: Node.js Express server for API and blockchain interaction
3. **frontend**: Next.js web application for user interface

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project_lend
```

### 2. Smart Contracts Setup

Navigate to the smart contracts directory:
```bash
cd smart-contracts
```

Install dependencies:
```bash
npm install
```

Create a `.env` file based on the example:
```bash
cp .env.example .env
```

Edit the `.env` file to add your:
- Private key (for contract deployment)
- Base Sepolia RPC endpoint

Deploy contracts to Base Sepolia:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network base-sepolia
```

Note the contract addresses from the deployment output.

### 3. Backend Setup

Navigate to the backend directory:
```bash
cd ../backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file based on the example:
```bash
cp .env.example .env
```

Edit the `.env` file to add your:
- Supabase URL and key
- Pinata API keys
- Private key
- Contract addresses from step 2

Start the backend server:
```bash
node server.js
```

The backend will be available at `http://localhost:3001`

### 4. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env.local` file:
```bash
cp .env.example .env.local
```

Edit the `.env.local` file to add your:
- API base URL (http://localhost:3001/api)
- Contract addresses from step 2

Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing

### Smart Contracts

Run smart contract tests:
```bash
cd smart-contracts
npx hardhat test
```

### Frontend

Run frontend tests:
```bash
cd frontend
npm run test
```

## Deployment

### Smart Contracts

To deploy to Base Sepolia:
```bash
cd smart-contracts
npx hardhat run scripts/deploy.js --network base-sepolia
```

### Frontend

To build for production:
```bash
cd frontend
npm run build
```

To deploy to Vercel:
1. Push your code to a GitHub repository
2. Create a new project on Vercel
3. Connect it to your GitHub repository
4. Configure environment variables
5. Deploy

## Environment Variables Summary

### Smart Contracts (.env)
- `BASE_SEPOLIA_RPC`: Base Sepolia RPC endpoint
- `PRIVATE_KEY`: Your wallet private key for deployments

### Backend (.env)
- `PORT`: Server port (default 3001)
- `BASE_SEPOLIA_RPC`: Base Sepolia RPC endpoint
- `PRIVATE_KEY`: Your wallet private key for transactions
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anon key
- `ACCESS_NFT_ADDRESS`: Deployed AccessNFT contract address
- `RENTAL_ESCROW_ADDRESS`: Deployed RentalEscrow contract address
- `PINATA_API_KEY`: Pinata API key
- `PINATA_SECRET_API_KEY`: Pinata secret API key

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC`: Base Sepolia RPC endpoint
- `NEXT_PUBLIC_ACCESS_NFT_ADDRESS`: AccessNFT contract address
- `NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS`: RentalEscrow contract address

## Troubleshooting

1. **Installation Issues**: Make sure you're using Node.js v18 or higher
2. **RPC Connection**: Verify your Base Sepolia RPC endpoint is correct
3. **Contract Deployment**: Ensure you have enough Base Sepolia ETH for gas
4. **Wallet Connection**: Use Coinbase Wallet for the best experience

## Next Steps

1. Test the full flow: List a subscription → Rent it → Verify access
2. Customize the UI to match your branding
3. Add more subscription providers
4. Implement additional security measures
5. Set up monitoring and analytics

## Support

For issues or questions, please open an issue on the GitHub repository.