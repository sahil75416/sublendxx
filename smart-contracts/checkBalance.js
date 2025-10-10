import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

async function checkBalance() {
  try {
    // Connect to Sepolia network
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("=== Wallet Information ===");
    console.log("Address:", wallet.address);
    console.log("\n=== Sepolia Testnet Balances ===");
    
    // Get ETH balance
    const ethBalance = await provider.getBalance(wallet.address);
    console.log("ETH Balance:", ethers.formatEther(ethBalance), "ETH");
    
    // Get USDC balance (if contract address exists)
    if (process.env.USDC_CONTRACT_ADDRESS && process.env.USDC_CONTRACT_ADDRESS !== "0x_contract_address_here") {
      const usdcAddress = process.env.USDC_CONTRACT_ADDRESS;
      const usdcAbi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];
      
      const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);
      const usdcBalance = await usdcContract.balanceOf(wallet.address);
      const decimals = await usdcContract.decimals();
      console.log("USDC Balance:", ethers.formatUnits(usdcBalance, decimals), "USDC");
    } else {
      console.log("USDC Balance: No USDC contract configured");
    }
    
  } catch (error) {
    console.error("Error checking balance:", error.message);
  }
}

checkBalance();
