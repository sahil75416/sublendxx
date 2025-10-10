// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IAccessNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function setUser(uint256 tokenId, address user, uint256 expires) external;
    function revokeUser(uint256 tokenId) external;
    function subscriptionName(uint256 tokenId) external view returns (string memory);
    function rentalPrice(uint256 tokenId) external view returns (uint256);
    function userOf(uint256 tokenId) external view returns (address);
    function userExpires(uint256 tokenId) external view returns (uint256);
}

contract RentalEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    struct Rental {
        uint256 tokenId;
        address lender;
        address borrower;
        uint256 amount;
        uint64 startTime;
        uint64 duration; // in minutes
        bool isActive;
        bool isPaidOut;
    }
    
    IERC20 public usdcToken;
    IAccessNFT public accessNFT;
    
    mapping(uint256 => Rental) public rentals;
    mapping(uint256 => uint256) public rentalIds;
    
    uint256 private _nextRentalId;
    
    event RentalCreated(uint256 indexed rentalId, uint256 indexed tokenId, address indexed lender, address borrower, uint256 amount);
    event PaymentReleased(uint256 indexed rentalId, address indexed lender, uint256 amount);
    event RentalCanceled(uint256 indexed rentalId, address indexed borrower, uint256 refundAmount);
    
    constructor(address _usdcTokenAddress, address _accessNFTAddress) {
        usdcToken = IERC20(_usdcTokenAddress);
        accessNFT = IAccessNFT(_accessNFTAddress);
    }
    
    function createRental(
        uint256 tokenId,
        address borrower,
        uint64 durationInMinutes
    ) external nonReentrant {
        // Transfer NFT from lender to this contract
        address lender = accessNFT.ownerOf(tokenId);
        require(msg.sender == lender, "Only lender can create rental");
        
        // Calculate payment amount
        uint256 pricePerMinute = accessNFT.rentalPrice(tokenId);
        uint256 totalAmount = pricePerMinute * durationInMinutes;
        
        // Create rental record
        uint256 rentalId = _nextRentalId++;
        rentals[rentalId] = Rental({
            tokenId: tokenId,
            lender: lender,
            borrower: borrower,
            amount: totalAmount,
            startTime: uint64(block.timestamp),
            duration: durationInMinutes,
            isActive: true,
            isPaidOut: false
        });
        
        rentalIds[tokenId] = rentalId;
        
        // Transfer USDC from borrower to escrow
        usdcToken.safeTransferFrom(borrower, address(this), totalAmount);
        
        // Set user on NFT for the specified duration
        uint256 expires = block.timestamp + (durationInMinutes * 60); // Convert minutes to seconds
        accessNFT.setUser(tokenId, borrower, expires);
        
        emit RentalCreated(rentalId, tokenId, lender, borrower, totalAmount);
    }
    
    function releasePayment(uint256 rentalId) external onlyOwner nonReentrant {
        Rental storage rental = rentals[rentalId];
        require(rental.isActive, "Rental not active");
        require(!rental.isPaidOut, "Payment already released");
        
        // Check if rental period has expired
        uint256 endTime = rental.startTime + (rental.duration * 60);
        require(block.timestamp >= endTime, "Rental period not ended");
        
        // Mark as paid out
        rental.isPaidOut = true;
        rental.isActive = false;
        
        // Transfer funds to lender
        usdcToken.safeTransfer(rental.lender, rental.amount);
        
        emit PaymentReleased(rentalId, rental.lender, rental.amount);
    }
    
    function cancelRental(uint256 rentalId) external nonReentrant {
        Rental storage rental = rentals[rentalId];
        require(rental.isActive, "Rental not active");
        require(msg.sender == rental.borrower || msg.sender == rental.lender, "Unauthorized");
        
        // Revoke user access
        accessNFT.revokeUser(rental.tokenId);
        
        uint256 refundAmount = rental.amount;
        
        // Mark rental as inactive
        rental.isActive = false;
        
        // Refund borrower
        usdcToken.safeTransfer(rental.borrower, refundAmount);
        
        emit RentalCanceled(rentalId, rental.borrower, refundAmount);
    }
    
    function checkRentalExpiry(uint256 rentalId) external view returns (bool) {
        Rental memory rental = rentals[rentalId];
        if (!rental.isActive) return true;
        
        uint256 endTime = rental.startTime + (rental.duration * 60);
        return block.timestamp >= endTime;
    }
    
    // Chainlink Automation compatible function
    function checkUpkeep(bytes calldata checkData) external view returns (bool upkeepNeeded, bytes memory performData) {
        // In a real implementation, this would check multiple rentals
        // For simplicity, we'll just show the pattern
        upkeepNeeded = false;
        performData = checkData;
    }
    
    function performUpkeep(bytes calldata performData) external {
        // Implementation for Chainlink Automation
        // Would iterate through expired rentals and release payments
    }
}