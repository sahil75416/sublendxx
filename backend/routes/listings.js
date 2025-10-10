const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');

// Get all listings
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Create a new listing
router.post('/', async (req, res) => {
  try {
    const { nftId, subscriptionName, pricePerMinute, metadataUri, lenderAddress } = req.body;

    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          nft_id: nftId,
          subscription_name: subscriptionName,
          price_per_minute: pricePerMinute,
          metadata_uri: metadataUri,
          lender_address: lenderAddress,
          active: true,
          created_at: new Date()
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get a specific listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

module.exports = router;