import { Contract, parseUnits, formatUnits } from 'ethers';

// Contract ABIs (simplified for key functions)
export const ACCESS_NFT_ABI = [
  "function mintNFT(address to, string memory uri, string memory subName, uint256 pricePerMinute) public returns (uint256)",
  "function setUser(uint256 tokenId, address user, uint256 expires) public",
  "function revokeUser(uint256 tokenId) public",
  "function userOf(uint256 tokenId) public view returns (address)",
  "function userExpires(uint256 tokenId) public view returns (uint256)",
  "function getSubscriptionName(uint256 tokenId) public view returns (string memory)",
  "function subscriptionName(uint256 tokenId) public view returns (string memory)",
  "function rentalPrice(uint256 tokenId) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function setRentalEscrow(address _rentalEscrow) public",
  "event Minted(uint256 indexed tokenId, address indexed owner, string subscriptionName)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export const RENTAL_ESCROW_ABI = [
  "function createRental(uint256 tokenId, address borrower, uint64 durationInMinutes) external",
  "function releasePayment(uint256 rentalId) external",
  "function cancelRental(uint256 rentalId) external",
  "function checkRentalExpiry(uint256 rentalId) external view returns (bool)",
  "function rentals(uint256 rentalId) external view returns (tuple(uint256 tokenId, address lender, address borrower, uint256 amount, uint64 startTime, uint64 duration, bool isActive, bool isPaidOut))",
  "function rentalIds(uint256 tokenId) external view returns (uint256)"
];

export const MOCK_USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function decimals() external view returns (uint8)"
];

// Contract addresses from environment
export const ACCESS_NFT_ADDRESS = process.env.NEXT_PUBLIC_ACCESS_NFT_ADDRESS || '';
export const RENTAL_ESCROW_ADDRESS = process.env.NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS || '';
export const MOCK_USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Ethereum Sepolia USDC

// Helper functions
export const getAccessNFTContract = (signer: any) => {
  return new Contract(ACCESS_NFT_ADDRESS, ACCESS_NFT_ABI, signer);
};

export const getRentalEscrowContract = (signer: any) => {
  return new Contract(RENTAL_ESCROW_ADDRESS, RENTAL_ESCROW_ABI, signer);
};

export const getMockUSDCContract = (signer: any) => {
  return new Contract(MOCK_USDC_ADDRESS, MOCK_USDC_ABI, signer);
};

// Convert price per hour to price per minute in wei
export const pricePerHourToWei = (pricePerHour: number): bigint => {
  // USDC has 6 decimals
  const pricePerMinute = pricePerHour / 60;
  return parseUnits(pricePerMinute.toFixed(6), 6);
};

// Convert wei to readable USDC amount
export const weiToUsdc = (wei: bigint): string => {
  return formatUnits(wei, 6);
};

// Check if wallet is on Ethereum Sepolia
export const isBaseSepoliaNetwork = async (provider: any): Promise<boolean> => {
  try {
    // If it's a BrowserProvider, use getNetwork()
    if (provider.getNetwork) {
      const network = await provider.getNetwork();
      return network.chainId === BigInt(11155111); // Ethereum Sepolia
    }
    return false;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

// Switch to Ethereum Sepolia network
export const switchToBaseSepolia = async (rawProvider: any) => {
  try {
    // rawProvider should be the actual wallet provider with .request() method
    if (!rawProvider || !rawProvider.request) {
      throw new Error('Invalid provider. Please ensure you are using MetaMask or Coinbase Wallet.');
    }
    
    await rawProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // 11155111 in hex (Ethereum Sepolia)
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to the wallet
    if (switchError.code === 4902) {
      try {
        await rawProvider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7', // 11155111 in hex
              chainName: 'Ethereum Sepolia',
              rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      } catch (addError) {
        throw addError;
      }
    }
    throw switchError;
  }
};

// Mint test USDC for testing
export const mintTestUSDC = async (signer: any, amount: number = 1000) => {
  try {
    const usdcContract = getMockUSDCContract(signer);
    const address = await signer.getAddress();
    const amountWei = parseUnits(amount.toString(), 6);
    
    const tx = await usdcContract.mint(address, amountWei);
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error('Error minting test USDC:', error);
    throw error;
  }
};

// Approve USDC spending
export const approveUSDC = async (signer: any, amount: bigint) => {
  try {
    const usdcContract = getMockUSDCContract(signer);
    const tx = await usdcContract.approve(RENTAL_ESCROW_ADDRESS, amount);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error approving USDC:', error);
    throw error;
  }
};

// Get USDC balance
export const getUSDCBalance = async (signer: any): Promise<string> => {
  try {
    const usdcContract = getMockUSDCContract(signer);
    const address = await signer.getAddress();
    const balance = await usdcContract.balanceOf(address);
    return weiToUsdc(balance);
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return '0';
  }
};
