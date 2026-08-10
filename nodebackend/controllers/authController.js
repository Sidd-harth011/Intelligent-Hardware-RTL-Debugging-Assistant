// nodebackend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_dev_key', { expiresIn: '10d' });
};

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // 1. Normalize the email BEFORE checking the database
    const normalizedEmail = email.toLowerCase();

    // 2. Use normalizedEmail in your query
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 3. Save the user using the normalizedEmail
    const user = await User.create({ 
      firstName, 
      lastName, 
      email: normalizedEmail, 
      password, 
      authProvider: 'local' 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email, // No need to lowercase here anymore, it's already lowercased in the DB
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error("SIGNUP CRASH REASON:", error); 
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Normalize the email BEFORE checking the database
    const normalizedEmail = email.toLowerCase();

    // 2. Use normalizedEmail in your query
    const user = await User.findOne({ email: normalizedEmail });
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email, // It's already lowercased in the DB
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};