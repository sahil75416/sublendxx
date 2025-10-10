import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("AccessNFT", function () {
  let accessNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const AccessNFT = await ethers.getContractFactory("AccessNFT");
    accessNFT = await AccessNFT.deploy();
    await accessNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await accessNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await accessNFT.name()).to.equal("SubLendX Access NFT");
      expect(await accessNFT.symbol()).to.equal("SLX");
    });
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      const tokenId = await accessNFT.mintNFT(
        addr1.address,
        "https://example.com/metadata/1",
        "Netflix",
        ethers.parseUnits("10", 6) // 10 USDC per minute
      );
      
      expect(await accessNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await accessNFT.getSubscriptionName(0)).to.equal("Netflix");
      expect(await accessNFT.rentalPrice(0)).to.equal(ethers.parseUnits("10", 6));
    });
  });

  describe("Borrowing", function () {
    beforeEach(async function () {
      // Mint an NFT first
      await accessNFT.mintNFT(
        owner.address,
        "https://example.com/metadata/1",
        "Netflix",
        ethers.parseUnits("10", 6)
      );
    });

    it("Should set a user for a specific duration", async function () {
      const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      await accessNFT.setUser(0, addr1.address, expires);
      
      expect(await accessNFT.userOf(0)).to.equal(addr1.address);
      expect(await accessNFT.userExpires(0)).to.equal(expires);
    });

    it("Should revoke user access", async function () {
      const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      await accessNFT.setUser(0, addr1.address, expires);
      
      await accessNFT.revokeUser(0);
      
      expect(await accessNFT.userOf(0)).to.equal(ethers.ZeroAddress);
    });
  });
});