// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AccessNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    
    // Mapping from token ID to subscription name
    mapping(uint256 => string) private _subscriptionNames;
    
    // Mapping from token ID to rental price per minute
    mapping(uint256 => uint256) private _rentalPrices;
    
    // Mapping for borrowed NFTs (user address and expiration time)
    mapping(uint256 => address) private _borrowers;
    mapping(uint256 => uint256) private _borrowerExpirations;
    
    // Address of the RentalEscrow contract that can set users
    address public rentalEscrow;
    
    event Minted(uint256 indexed tokenId, address indexed owner, string subscriptionName);
    event Borrowed(uint256 indexed tokenId, address indexed user, uint256 expires);
    event Revoked(uint256 indexed tokenId, address indexed user);

    constructor() ERC721("SubLendX Access NFT", "SLX") {}

    // Set the rental escrow address (can only be called by owner)
    function setRentalEscrow(address _rentalEscrow) public onlyOwner {
        rentalEscrow = _rentalEscrow;
    }

    function mintNFT(address to, string memory uri, string memory subName, uint256 pricePerMinute) 
        public returns (uint256) {
        // Allow anyone to mint their own subscription NFT
        require(to == msg.sender, "Can only mint to yourself");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _subscriptionNames[tokenId] = subName;
        _rentalPrices[tokenId] = pricePerMinute;
        
        emit Minted(tokenId, to, subName);
        return tokenId;
    }

    function setUser(uint256 tokenId, address user, uint256 expires) 
        public {
        // Only owner or rental escrow can set user
        require(msg.sender == owner() || msg.sender == rentalEscrow, "Unauthorized");
        require(ownerOf(tokenId) == msg.sender || msg.sender == rentalEscrow, "Not owner or escrow");
        require(expires > block.timestamp, "Expiration must be in the future");
        
        _borrowers[tokenId] = user;
        _borrowerExpirations[tokenId] = expires;
        
        emit Borrowed(tokenId, user, expires);
    }

    function revokeUser(uint256 tokenId) public {
        // Only owner or rental escrow can revoke user
        require(msg.sender == owner() || msg.sender == rentalEscrow, "Unauthorized");
        
        address currentUser = _borrowers[tokenId];
        delete _borrowers[tokenId];
        delete _borrowerExpirations[tokenId];
        emit Revoked(tokenId, currentUser);
    }
    
    function userOf(uint256 tokenId) public view returns (address) {
        // Check if the borrowing period has expired
        if (_borrowerExpirations[tokenId] < block.timestamp) {
            return address(0);
        }
        return _borrowers[tokenId];
    }
    
    function userExpires(uint256 tokenId) public view returns (uint256) {
        return _borrowerExpirations[tokenId];
    }

    function getSubscriptionName(uint256 tokenId) public view returns (string memory) {
        return _subscriptionNames[tokenId];
    }

    function subscriptionName(uint256 tokenId) public view returns (string memory) {
        return _subscriptionNames[tokenId];
    }

    function rentalPrice(uint256 tokenId) public view returns (uint256) {
        return _rentalPrices[tokenId];
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete _subscriptionNames[tokenId];
        delete _rentalPrices[tokenId];
        delete _borrowers[tokenId];
        delete _borrowerExpirations[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}