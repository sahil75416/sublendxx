require('dotenv').config();
const { ethers } = require('ethers');

function getEthersProvider() {
  const providerUrl = process.env.SEPOLIA_RPC || 'https://rpc.sepolia.org';
  return new ethers.JsonRpcProvider(providerUrl);
}

function getEthersSigner() {
  const provider = getEthersProvider();
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error('PRIVATE_KEY not found in environment variables');
  return new ethers.Wallet(privateKey, provider);
}

function getRentalEscrowContract() {
  const signer = getEthersSigner();
  const contractAddress = process.env.RENTAL_ESCROW_ADDRESS;
  if (!contractAddress) throw new Error('RENTAL_ESCROW_ADDRESS not found in environment variables');
  const contractABI = [
    "function createRental(uint256 tokenId, address borrower, uint64 durationInMinutes) external",
    "function releasePayment(uint256 rentalId) external",
    "function cancelRental(uint256 rentalId) external"
  ];
  return new ethers.Contract(contractAddress, contractABI, signer);
}

function getAccessNFTContract() {
  const signer = getEthersSigner();
  const contractAddress = process.env.ACCESS_NFT_ADDRESS;
  if (!contractAddress) throw new Error('ACCESS_NFT_ADDRESS not found in environment variables');
  const contractABI = [
    "function mintNFT(address to, string memory uri, string memory subscriptionName, uint256 pricePerMinute) public returns (uint256)",
    "function setUser(uint256 tokenId, address user, uint64 expires) public",
    "function revokeUser(uint256 tokenId) public",
    "function subscriptionName(uint256 tokenId) public view returns (string memory)",
    "function rentalPrice(uint256 tokenId) public view returns (uint256)"
  ];
  return new ethers.Contract(contractAddress, contractABI, signer);
}

module.exports = { getEthersProvider, getEthersSigner, getRentalEscrowContract, getAccessNFTContract };