const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user storage (for demo purposes)
const usersStore = [];

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Signup request received:', { name, email });

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existingUser = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      walletAddress: null
    };

    // Store user
    usersStore.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('User created successfully:', newUser.email);
    console.log('Total users:', usersStore.length);

    res.status(201).json({
      success: true,
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Failed to create account',
      details: error.message
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request received:', { email });

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('User logged in successfully:', user.email);

    res.json({
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      walletAddress: user.walletAddress,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = usersStore.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // In a real app, you might invalidate the token in a database
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Link wallet to account
router.post('/link-wallet', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { walletAddress } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find and update user
    const user = usersStore.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.walletAddress = walletAddress;

    console.log('Wallet linked:', { email: user.email, wallet: walletAddress });

    res.json({
      success: true,
      walletAddress: user.walletAddress,
      message: 'Wallet linked successfully'
    });
  } catch (error) {
    console.error('Link wallet error:', error);
    res.status(500).json({
      error: 'Failed to link wallet',
      details: error.message
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = usersStore.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      details: error.message
    });
  }
});

// ===== ADMIN ENDPOINTS =====

// Get all users (Admin only - for demo purposes)
router.get('/admin/users', (req, res) => {
  try {
    // In production, you'd verify admin privileges here
    const usersWithoutPasswords = usersStore.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt
    }));

    res.json({
      success: true,
      totalUsers: usersStore.length,
      users: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      details: error.message
    });
  }
});

// Get user statistics
router.get('/admin/stats', (req, res) => {
  try {
    const totalUsers = usersStore.length;
    const usersWithWallets = usersStore.filter(u => u.walletAddress).length;
    const recentUsers = usersStore.filter(u => {
      const createdDate = new Date(u.createdAt);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return createdDate > dayAgo;
    }).length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        usersWithWallets,
        usersWithoutWallets: totalUsers - usersWithWallets,
        recentUsers24h: recentUsers,
        lastSignup: usersStore.length > 0 ? usersStore[usersStore.length - 1].createdAt : null
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      details: error.message
    });
  }
});

// Delete user by ID (Admin only)
router.delete('/admin/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userIndex = usersStore.findIndex(u => u.id === parseInt(userId));

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = usersStore[userIndex];
    usersStore.splice(userIndex, 1);

    console.log('User deleted by admin:', deletedUser.email);

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: deletedUser.id,
        email: deletedUser.email,
        name: deletedUser.name
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      details: error.message
    });
  }
});

// Clear all users (Admin only - DANGEROUS!)
router.post('/admin/clear-users', (req, res) => {
  try {
    const count = usersStore.length;
    usersStore.length = 0; // Clear array

    console.log('⚠️  All users cleared by admin. Count:', count);

    res.json({
      success: true,
      message: `All ${count} users have been cleared`,
      clearedCount: count
    });
  } catch (error) {
    console.error('Clear users error:', error);
    res.status(500).json({
      error: 'Failed to clear users',
      details: error.message
    });
  }
});

module.exports = router;
