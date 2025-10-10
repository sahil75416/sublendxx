const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');
const { ethers } = require('ethers');
const { getEthersProvider, getRentalEscrowContract } = require('../utils/ethersHelper');
const rentalsStore = [];
const listingsStore = []; // Store for user listings

// Create a rental agreement (WORKS WITHOUT DATABASE)
router.post('/', async (req, res) => {
  try {
    const { nftId, borrowerAddress, durationInMinutes } = req.body;

    console.log('Rental request received:', { nftId, borrowerAddress, durationInMinutes });

    // Validate inputs
    if (!nftId || !borrowerAddress || !durationInMinutes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate values
    const pricePerMinute = 0.1;
    const totalAmount = pricePerMinute * durationInMinutes;
    const endTime = new Date(Date.now() + durationInMinutes * 60000);

    // Subscription names mapping
    const subscriptionNames = {
      1: 'Netflix',
      2: 'Spotify Premium',
      3: 'Canva Pro',
      4: 'Adobe Creative Cloud',
      5: 'ChatGPT Plus',
      6: 'Midjourney'
    };

    // Create rental and store in memory
    const mockRental = {
      id: Date.now(), // Use timestamp as unique ID
      nft_id: nftId,
      lender_address: '0x0000000000000000000000000000000000000000',
      borrower_address: borrowerAddress,
      duration_minutes: durationInMinutes,
      total_amount: totalAmount,
      status: 'active',
      end_time: endTime.toISOString(),
      created_at: new Date().toISOString(),
      listings: {
        name: subscriptionNames[nftId] || `Subscription #${nftId}`,
        price_per_minute: pricePerMinute
      }
    };

    // Save to in-memory store
    rentalsStore.push(mockRental);

    console.log('Rental created and stored:', mockRental);
    console.log('Total rentals in store:', rentalsStore.length);

    res.status(201).json({
      success: true,
      rentalId: mockRental.id,
      nftId,
      totalAmount,
      endTime: endTime.toISOString(),
      message: 'Rental agreement created successfully'
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ 
      error: 'Failed to create rental agreement',
      details: error.message 
    });
  }
});

// Get all active listings (for marketplace) - MUST BE BEFORE /:id route
router.get('/listings', async (req, res) => {
  try {
    console.log('Fetching all listings, total:', listingsStore.length);
    
    // Return all active listings
    const activeListings = listingsStore.filter(listing => listing.active);
    
    console.log('Active listings:', activeListings.length);
    res.json(activeListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.json([]);
  }
});

// Get rental by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching rental:', error);
    res.status(500).json({ error: 'Failed to fetch rental' });
  }
});

// Cancel rental
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    // Get rental details
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', id)
      .single();

    if (rentalError) throw rentalError;
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    // Update rental status
    const { data, error } = await supabase
      .from('rentals')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Re-activate the listing
    await supabase
      .from('listings')
      .update({ active: true })
      .eq('nft_id', rental.nft_id);

    res.json({
      message: 'Rental cancelled successfully',
      rental: data
    });
  } catch (error) {
    console.error('Error cancelling rental:', error);
    res.status(500).json({ error: 'Failed to cancel rental' });
  }
});
// Get all rentals for a user (as borrower) - MOCK VERSION
router.get('/user/:address/rented', async (req, res) => {
  try {
    const { address } = req.params;
    
    console.log('Fetching rented subscriptions for:', address);
    console.log('Total rentals in store:', rentalsStore.length);

    // Filter rentals for this user
    const userRentals = rentalsStore.filter(
      rental => rental.borrower_address.toLowerCase() === address.toLowerCase()
    );

    console.log('User rentals found:', userRentals.length);
    res.json(userRentals);
  } catch (error) {
    console.error('Error fetching rented subscriptions:', error);
    res.json([]);
  }
});

// Get all rentals for a user (as lender) - MOCK VERSION
router.get('/user/:address/lent', async (req, res) => {
  try {
    const { address } = req.params;
    
    console.log('Fetching lent subscriptions for:', address);

    // Filter listings for this user
    const userListings = listingsStore.filter(
      listing => listing.lender_address.toLowerCase() === address.toLowerCase()
    );

    console.log('User listings found:', userListings.length);
    res.json(userListings);
  } catch (error) {
    console.error('Error fetching lent subscriptions:', error);
    res.json([]);
  }
});

// Create a new listing
router.post('/listing', async (req, res) => {
  try {
    const { name, description, lenderAddress, pricePerMinute, maxDuration, category, nftId, transactionHash } = req.body;

    console.log('Listing request received:', { name, lenderAddress, pricePerMinute, nftId, transactionHash });

    // Validate inputs
    if (!name || !lenderAddress || !pricePerMinute) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!nftId && nftId !== 0) {
      return res.status(400).json({ error: 'NFT ID is required from blockchain mint' });
    }

    // Create listing and store in memory
    const newListing = {
      id: Date.now(),
      nft_id: parseInt(nftId), // Use actual NFT ID from blockchain
      name,
      description: description || `Access to ${name}`,
      lender_address: lenderAddress,
      price_per_minute: parseFloat(pricePerMinute),
      price_per_hour: parseFloat(pricePerMinute) * 60,
      max_duration: maxDuration || 24,
      category: category || 'other',
      active: true,
      created_at: new Date().toISOString(),
      transaction_hash: transactionHash,
      rentals_count: 0,
      total_earned: 0
    };

    // Save to in-memory store
    listingsStore.push(newListing);

    console.log('Listing created:', newListing);
    console.log('Total listings in store:', listingsStore.length);

    res.status(201).json({
      success: true,
      listingId: newListing.id,
      listing: newListing,
      message: 'Listing created successfully'
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ 
      error: 'Failed to create listing',
      details: error.message 
    });
  }
});

// Delete a listing
router.delete('/listing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listingIndex = listingsStore.findIndex(l => l.id === parseInt(id));

    if (listingIndex === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    listingsStore.splice(listingIndex, 1);
    console.log('Listing deleted, remaining:', listingsStore.length);

    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;