import hre from "hardhat";

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Deploy AccessNFT
  const AccessNFT = await hre.ethers.getContractFactory("AccessNFT");
  const accessNFT = await AccessNFT.deploy();
  await accessNFT.waitForDeployment();
  const accessNFTAddr = await accessNFT.getAddress();
  console.log("AccessNFT:", accessNFTAddr);
  
  // Deploy RentalEscrow
  const usdcAddr = process.env.USDC_CONTRACT_ADDRESS || "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  const RentalEscrow = await hre.ethers.getContractFactory("RentalEscrow");
  const rentalEscrow = await RentalEscrow.deploy(usdcAddr, accessNFTAddr);
  await rentalEscrow.waitForDeployment();
  const rentalEscrowAddr = await rentalEscrow.getAddress();
  console.log("RentalEscrow:", rentalEscrowAddr);
  
  // Link contracts
  await accessNFT.setRentalEscrow(rentalEscrowAddr);
  console.log("Linked!");
  
  console.log("\n=== COPY TO frontend/.env ===");
  console.log("NEXT_PUBLIC_ACCESS_NFT_ADDRESS=" + accessNFTAddr);
  console.log("NEXT_PUBLIC_RENTAL_ESCROW_ADDRESS=" + rentalEscrowAddr);
}

main().catch(console.error);
