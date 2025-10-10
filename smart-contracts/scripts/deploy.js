import hre from "hardhat";

async function main() {
  // Get accounts
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Use Base Sepolia USDC or the one from .env
  let usdcAddress = process.env.USDC_CONTRACT_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  console.log("Using USDC contract at:", usdcAddress);

  // Deploy AccessNFT contract
  console.log("\n📝 Deploying AccessNFT...");
  const AccessNFT = await hre.ethers.getContractFactory("AccessNFT");
  const accessNFT = await AccessNFT.deploy();
  await accessNFT.waitForDeployment();
  
  const accessNFTAddress = await accessNFT.getAddress();
  console.log("✅ AccessNFT deployed to:", accessNFTAddress);

  // Deploy RentalEscrow contract
  console.log("\n📝 Deploying RentalEscrow...");
  const RentalEscrow = await hre.ethers.getContractFactory("RentalEscrow");
  const rentalEscrow = await RentalEscrow.deploy(usdcAddress, accessNFTAddress);
  await rentalEscrow.waitForDeployment();
  
  const rentalEscrowAddress = await rentalEscrow.getAddress();
  console.log("✅ RentalEscrow deployed to:", rentalEscrowAddress);

  // Set rental escrow in AccessNFT
  console.log("\n📝 Setting RentalEscrow in AccessNFT...");
  await accessNFT.setRentalEscrow(rentalEscrowAddress);
  console.log("✅ RentalEscrow set in AccessNFT");

  // Log contract addresses for future reference
  console.log("\n========================================");
  console.log("📋 CONTRACT ADDRESSES (Ethereum Sepolia)");
  console.log("========================================");
  console.log("USDC:", usdcAddress);
  console.log("AccessNFT:", accessNFTAddress);
  console.log("RentalEscrow:", rentalEscrowAddress);
  console.log("========================================");
  console.log("\n✅ DEPLOYMENT COMPLETE!");
  console.log("\n📌 Next Steps:");
  console.log("1. Copy the addresses above to frontend/.env:");
  console.log("   NEXT_PUBLIC_ACCESS_NFT_ADDRESS=" + accessNFTAddress);
  console.log("   NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=" + rentalEscrowAddress);
  console.log("2. Restart your frontend server");
  console.log("3. Test minting in the UI!");
}

main()
  .then(() => {
    console.log("\n✅ All done!");
    // Don't call process.exit() on Windows to avoid crash
    setTimeout(() => process.exit(0), 1000);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    setTimeout(() => process.exit(1), 1000);
  });