import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("RentalEscrow", function () {
  let rentalEscrow;
  let accessNFT;
  let owner;
  let addr1;
  let addr2;
  let usdcToken;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy mock USDC token
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdcToken = await MockUSDC.deploy("USDC", "USDC", owner.address, ethers.parseUnits("1000000", 6));
    await usdcToken.waitForDeployment();
    
    // Mint some tokens for addr1 and addr2
    await usdcToken.mint(addr1.address, ethers.parseUnits("10000", 6));
    await usdcToken.mint(addr2.address, ethers.parseUnits("10000", 6));
    
    // Deploy AccessNFT
    const AccessNFT = await ethers.getContractFactory("AccessNFT");
    accessNFT = await AccessNFT.deploy();
    await accessNFT.waitForDeployment();
    
    // Deploy RentalEscrow
    const RentalEscrow = await ethers.getContractFactory("RentalEscrow");
    rentalEscrow = await RentalEscrow.deploy(await usdcToken.getAddress(), await accessNFT.getAddress());
    await rentalEscrow.waitForDeployment();
    
    // Set rental escrow address in AccessNFT
    await accessNFT.setRentalEscrow(await rentalEscrow.getAddress());
    
    // Mint an NFT
    await accessNFT.mintNFT(
      owner.address,
      "https://example.com/metadata/1",
      "Netflix",
      ethers.parseUnits("10", 6) // 10 USDC per minute
    );
    
    // Approve USDC for rental escrow
    await usdcToken.connect(owner).approve(await rentalEscrow.getAddress(), ethers.parseUnits("10000", 6));
    await usdcToken.connect(addr1).approve(await rentalEscrow.getAddress(), ethers.parseUnits("10000", 6));
    await usdcToken.connect(addr2).approve(await rentalEscrow.getAddress(), ethers.parseUnits("10000", 6));
  });

  describe("Deployment", function () {
    it("Should set the correct USDC and AccessNFT addresses", async function () {
      expect(await rentalEscrow.usdcToken()).to.equal(await usdcToken.getAddress());
      expect(await rentalEscrow.accessNFT()).to.equal(await accessNFT.getAddress());
    });
  });

  describe("Rental Creation", function () {
    it("Should create a rental successfully", async function () {
      // Transfer NFT to addr1 for testing
      await accessNFT.transferFrom(owner.address, addr1.address, 0);
      
      // Approve rental escrow to manage the NFT
      await accessNFT.connect(addr1).approve(await rentalEscrow.getAddress(), 0);
      
      // Create rental
      const duration = 60; // 60 minutes
      await expect(rentalEscrow.connect(addr1).createRental(0, addr2.address, duration))
        .to.emit(rentalEscrow, "RentalCreated")
        .withArgs(0, 0, addr1.address, addr2.address, ethers.parseUnits("600", 6)); // 10 * 60 = 600 USDC
    });
  });

  describe("Payment Release", function () {
    it("Should release payment to lender after rental period", async function () {
      // Transfer NFT to addr1 for testing
      await accessNFT.transferFrom(owner.address, addr1.address, 0);
      
      // Approve rental escrow to manage the NFT
      await accessNFT.connect(addr1).approve(await rentalEscrow.getAddress(), 0);
      
      // Create rental
      const duration = 1; // 1 minute
      await rentalEscrow.connect(addr1).createRental(0, addr2.address, duration);
      
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [61]); // 61 seconds
      await ethers.provider.send("evm_mine");
      
      // Release payment
      await expect(rentalEscrow.releasePayment(0))
        .to.emit(rentalEscrow, "PaymentReleased")
        .withArgs(0, addr1.address, ethers.parseUnits("10", 6));
    });
  });

  describe("Rental Cancellation", function () {
    it("Should cancel rental and refund borrower", async function () {
      // Transfer NFT to addr1 for testing
      await accessNFT.transferFrom(owner.address, addr1.address, 0);
      
      // Approve rental escrow to manage the NFT
      await accessNFT.connect(addr1).approve(await rentalEscrow.getAddress(), 0);
      
      // Create rental
      const duration = 60; // 60 minutes
      await rentalEscrow.connect(addr1).createRental(0, addr2.address, duration);
      
      // Cancel rental
      await expect(rentalEscrow.connect(addr1).cancelRental(0))
        .to.emit(rentalEscrow, "RentalCanceled")
        .withArgs(0, addr2.address, ethers.parseUnits("600", 6));
    });
  });
});