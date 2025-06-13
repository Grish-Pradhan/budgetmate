const { User } = require('../models/db'); // Sequelize models/index.js exports User
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Check if username or email exists
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS) || 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.json({ message: 'Logged out successfully.' });
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  register,
  login,
  logout,
  deleteUser
};