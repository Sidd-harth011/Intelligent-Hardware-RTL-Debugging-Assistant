const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Intelligent Hardware Debugger API is running...');
});

app.listen(PORT, () => {
  console.log(`Node backend running on port ${PORT}`);
});