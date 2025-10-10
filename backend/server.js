require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// const listingsRouter = require('./routes/listings');
const rentRouter = require('./routes/rent');
const authRouter = require('./routes/auth');
// const x402Router = require('./routes/x402');

// app.use('/api/listings', listingsRouter);
app.use('/api/rent', rentRouter);
app.use('/api/auth', authRouter);
// app.use('/api/x402', x402Router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SubLendX Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`SubLendX Backend Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;