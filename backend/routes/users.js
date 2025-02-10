const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ 
        field: 'email',
        message: 'Email already exists, login instead' 
      });
    }

    // Check if password was used by another user
    const passwordHash = await bcrypt.hash(password, 10);
    const passwordExists = await User.findOne({ password: passwordHash });
    if (passwordExists) {
      return res.status(400).json({ 
        field: 'password',
        message: 'This password is already in use by another account' 
      });
    }

    // Determine role based on email pattern
    const isAdmin = email.toLowerCase().includes('rpadmin');

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: isAdmin ? 'admin' : 'user'
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        field: 'email',
        message: 'Email not found' 
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ 
        field: 'password',
        message: 'Invalid password' 
      });
    }

    // Update role if email contains 'RPAdmin' but role is not set to admin
    const shouldBeAdmin = email.toLowerCase().includes('rpadmin');
    if (shouldBeAdmin && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    // Return user information including role
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Create admin user route (for testing purposes)
router.post('/create-admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

module.exports = router; 