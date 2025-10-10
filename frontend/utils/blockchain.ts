import { connectWallet } from './wallet';
import {
  getAccessNFTContract,
  getRentalEscrowContract,
  getMockUSDCContract,
  pricePerHourToWei,
  approveUSDC,
  isBaseSepoliaNetwork,
  switchToBaseSepolia,
  weiToUsdc,
} from './contracts';
import { parseUnits } from 'ethers';

// Mint NFT for a subscription listing
export const mintSubscriptionNFT = async (
  subscriptionName: string,
  description: string,
  pricePerHour: number,
  metadataUri: string
) => {
  try {
    // Connect wallet
    console.log('🔗 Connecting wallet...');
    const { signer, provider, rawProvider } = await connectWallet();
    
    const ownerAddress = await signer.getAddress();
    console.log('✅ Wallet connected:', ownerAddress);
    
    // Check network
    console.log('🌐 Checking network...');
    const isCorrectNetwork = await isBaseSepoliaNetwork(provider);
    if (!isCorrectNetwork) {
      console.log('⚠️  Wrong network, switching to Ethereum Sepolia...');
      await switchToBaseSepolia(rawProvider); // Pass rawProvider instead of provider
      console.log('✅ Switched to Ethereum Sepolia');
    } else {
      console.log('✅ Already on Ethereum Sepolia');
    }
    
    // Get contract
    const accessNFTContract = getAccessNFTContract(signer);
    console.log('📄 Contract initialized');
    
    // Convert price to wei (price per minute)
    const pricePerMinuteWei = pricePerHourToWei(pricePerHour);
    console.log('💰 Price per minute (wei):', pricePerMinuteWei.toString());
    
    // Mint NFT
    console.log('🎨 Minting NFT...');
    console.log('  - To:', ownerAddress);
    console.log('  - Name:', subscriptionName);
    console.log('  - Price/min:', pricePerMinuteWei.toString());
    
    const tx = await accessNFTContract.mintNFT(
      ownerAddress,
      metadataUri,
      subscriptionName,
      pricePerMinuteWei
    );
    
    console.log('📝 Transaction sent:', tx.hash);
    console.log('⏳ Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    
    // Extract token ID from events
    let tokenId = null;
    
    // Try to parse the Minted event from logs
    for (const log of receipt.logs) {
      try {
        const parsed = accessNFTContract.interface.parseLog({
          topics: [...log.topics],
          data: log.data
        });
        
        if (parsed && parsed.name === 'Minted') {
          tokenId = parsed.args.tokenId.toString();
          console.log('🎫 Token ID from event:', tokenId);
          break;
        }
      } catch (e) {
        // Not the event we're looking for, continue
      }
    }
    
    // If we couldn't get it from events, check Transfer event (ERC721)
    if (!tokenId) {
      for (const log of receipt.logs) {
        try {
          const parsed = accessNFTContract.interface.parseLog({
            topics: [...log.topics],
            data: log.data
          });
          
          if (parsed && parsed.name === 'Transfer' && parsed.args.from === '0x0000000000000000000000000000000000000000') {
            tokenId = parsed.args.tokenId.toString();
            console.log('🎫 Token ID from Transfer event:', tokenId);
            break;
          }
        } catch (e) {
          // Continue
        }
      }
    }
    
    if (!tokenId) {
      console.error('⚠️  Could not extract token ID from events');
      console.log('Receipt logs:', receipt.logs);
    }
    
    return {
      success: true,
      tokenId,
      transactionHash: receipt.hash,
    };
  } catch (error: any) {
    console.error('❌ Error minting NFT:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to mint NFT';
    
    if (error.message?.includes('user rejected')) {
      errorMessage = 'Transaction cancelled by user';
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient ETH for gas fees. Get test ETH from Ethereum Sepolia faucet (https://www.alchemy.com/faucets/ethereum-sepolia).';
    } else if (error.message?.includes('Ownable: caller is not the owner')) {
      errorMessage = 'Only contract owner can mint NFTs. Please deploy your own contract or contact admin.';
    } else if (error.code === 'CALL_EXCEPTION') {
      errorMessage = 'Contract call failed. The contract may not be deployed or you may not have permission.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Create rental (borrower rents from lender)
export const createRental = async (
  tokenId: number,
  durationInMinutes: number,
  totalPrice: number
) => {
  try {
    // Connect wallet
    const { signer, provider, rawProvider } = await connectWallet();
    
    // Check network
    const isCorrectNetwork = await isBaseSepoliaNetwork(provider);
    if (!isCorrectNetwork) {
      await switchToBaseSepolia(rawProvider);
    }
    
    // Get contracts
    const rentalEscrowContract = getRentalEscrowContract(signer);
    const usdcContract = getMockUSDCContract(signer);
    
    // Get borrower address
    const borrowerAddress = await signer.getAddress();
    
    // Convert price to wei (USDC has 6 decimals)
    const amountWei = parseUnits(totalPrice.toString(), 6);
    
    // Check USDC balance
    const balance = await usdcContract.balanceOf(borrowerAddress);
    if (balance < amountWei) {
      throw new Error(`Insufficient USDC balance. You need ${totalPrice} USDC but have ${weiToUsdc(balance)} USDC`);
    }
    
    // Approve USDC spending
    const approveTx = await approveUSDC(signer, amountWei);
    console.log('USDC approved:', approveTx);
    
    // Create rental
    const tx = await rentalEscrowContract.createRental(
      tokenId,
      borrowerAddress,
      durationInMinutes
    );
    
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash,
    };
  } catch (error: any) {
    console.error('Error creating rental:', error);
    throw new Error(error.message || 'Failed to create rental');
  }
};

// Get NFT details
export const getNFTDetails = async (tokenId: number) => {
  try {
    const { signer } = await connectWallet();
    const accessNFTContract = getAccessNFTContract(signer);
    
    const [subscriptionName, pricePerMinuteWei, owner, currentUser, userExpires] = await Promise.all([
      accessNFTContract.subscriptionName(tokenId),
      accessNFTContract.rentalPrice(tokenId),
      accessNFTContract.ownerOf(tokenId),
      accessNFTContract.userOf(tokenId),
      accessNFTContract.userExpires(tokenId),
    ]);
    
    const pricePerMinute = parseFloat(weiToUsdc(pricePerMinuteWei));
    const pricePerHour = pricePerMinute * 60;
    
    return {
      tokenId,
      subscriptionName,
      pricePerMinute,
      pricePerHour,
      owner,
      currentUser,
      userExpires: Number(userExpires),
    };
  } catch (error) {
    console.error('Error getting NFT details:', error);
    throw error;
  }
};

// Check if user has access to NFT
export const checkUserAccess = async (tokenId: number, userAddress: string) => {
  try {
    const { signer } = await connectWallet();
    const accessNFTContract = getAccessNFTContract(signer);
    
    const currentUser = await accessNFTContract.userOf(tokenId);
    const expires = await accessNFTContract.userExpires(tokenId);
    
    const hasAccess = currentUser.toLowerCase() === userAddress.toLowerCase() && Number(expires) > Date.now() / 1000;
    
    return {
      hasAccess,
      expires: Number(expires),
    };
  } catch (error) {
    console.error('Error checking user access:', error);
    return { hasAccess: false, expires: 0 };
  }
};

// Cancel rental
export const cancelRental = async (rentalId: number) => {
  try {
    const { signer } = await connectWallet();
    const rentalEscrowContract = getRentalEscrowContract(signer);
    
    const tx = await rentalEscrowContract.cancelRental(rentalId);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash,
    };
  } catch (error: any) {
    console.error('Error canceling rental:', error);
    throw new Error(error.message || 'Failed to cancel rental');
  }
};
