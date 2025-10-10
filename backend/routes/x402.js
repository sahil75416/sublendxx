const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory store for access tokens (in production, use Redis or database)
const accessTokens = new Map();

// Process x402 payment
router.post('/payment', async (req, res) => {
  try {
    const { rentalId, paymentSignature } = req.body;

    // In a real implementation, you would verify the payment signature
    // and interact with the smart contracts to confirm payment

    // For now, we'll simulate payment verification
    const isPaymentValid = verifyPaymentSignature(rentalId, paymentSignature);

    if (!isPaymentValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Generate access token
    const accessToken = generateAccessToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store access token
    accessTokens.set(accessToken, {
      rentalId,
      expiresAt
    });

    res.json({
      accessToken,
      expiresAt,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Error processing x402 payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Verify access token
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const tokenData = accessTokens.get(token);

    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    if (tokenData.expiresAt < new Date()) {
      accessTokens.delete(token);
      return res.status(401).json({ error: 'Access token expired' });
    }

    res.json({
      valid: true,
      rentalId: tokenData.rentalId,
      expiresAt: tokenData.expiresAt
    });
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(500).json({ error: 'Failed to verify access token' });
  }
});

// Helper function to verify payment signature (simplified)
function verifyPaymentSignature(rentalId, signature) {
  // In a real implementation, this would verify the signature against
  // the blockchain transaction
  return signature && signature.length > 0;
}

// Helper function to generate access token
function generateAccessToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = router;