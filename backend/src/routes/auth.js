const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Name, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Please provide a valid email address' 
      });
    }

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error checking existing user' 
        });
      }

      if (user) {
        return res.status(400).json({ 
          error: 'User exists',
          message: 'An account with this email already exists' 
        });
      }

      try {
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          function(err) {
            if (err) {
              console.error('Error creating user:', err);
              return res.status(500).json({ 
                error: 'Database error',
                message: 'Error creating user account' 
              });
            }

            const token = generateToken({ 
              userId: this.lastID, 
              email,
              name 
            });

            res.status(201).json({
              success: true,
              message: 'Account created successfully',
              token,
              user: { 
                id: this.lastID, 
                name, 
                email 
              }
            });
          }
        );
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({ 
          error: 'Server error',
          message: 'Error processing password' 
        });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Internal server error during registration' 
    });
  }
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Email and password are required' 
    });
  }

  // Find user by email
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        message: 'Error finding user' 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }

    try {
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Invalid email or password' 
        });
      }

      // Generate token
      const token = generateToken({ 
        userId: user.id, 
        email: user.email,
        name: user.name 
      });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email 
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Server error',
        message: 'Error during login process' 
      });
    }
  });
});

// Get user profile
router.get('/profile', require('../middleware/auth').authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get(
    'SELECT id, name, email, created_at FROM users WHERE id = ?', 
    [userId], 
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error fetching user profile' 
        });
      }

      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          message: 'User profile not found' 
        });
      }

      res.json({
        success: true,
        user: user
      });
    }
  );
});

// Update user profile
router.put('/profile', require('../middleware/auth').authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Name is required' 
    });
  }

  db.run(
    'UPDATE users SET name = ? WHERE id = ?',
    [name, userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error updating profile' 
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ 
          error: 'User not found',
          message: 'User not found' 
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    }
  );
});

module.exports = router;