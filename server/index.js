require('dotenv').config();                // Loads .env variables
const express = require('express');        // Imports Express
const cors = require('cors');              // Enables CORS
const transactionRoutes = require('./routes/transactions'); // Transactions route
const authRoutes = require('./routes/auth');                 // Auth route

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());             // Allows frontend requests
app.use(express.json());     // Parses incoming JSON

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
