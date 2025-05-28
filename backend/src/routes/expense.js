const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../controllers/auth');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Add new expense
router.post('/', (req, res) => {
  const { category, amount, quantity = 1, description, date } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!category || !amount) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Category and amount are required' 
    });
  }

  if (amount <= 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Amount must be greater than 0' 
    });
  }

  if (quantity <= 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Quantity must be greater than 0' 
    });
  }

  const totalAmount = parseFloat(amount) * parseInt(quantity);
  const insertDate = date || new Date().toISOString();

  db.run(
    'INSERT INTO expenses (user_id, category, amount, quantity, description, date) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, category, totalAmount, parseInt(quantity), description || '', insertDate],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error adding expense' 
        });
      }

      res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        expense: { 
          id: this.lastID, 
          category,
          amount: totalAmount,
          quantity: parseInt(quantity),
          description: description || '',
          date: insertDate
        }
      });
    }
  );
});

// Get all expenses for user
router.get('/', (req, res) => {
  const userId = req.user.userId;
  const { category, month, year, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM expenses WHERE user_id = ?';
  let params = [userId];

  // Filter by category if provided
  if (category) {
    query += ' AND LOWER(category) LIKE LOWER(?)';
    params.push(`%${category}%`);
  }

  // Filter by month/year if provided
  if (month && year) {
    query += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
    params.push(month.toString().padStart(2, '0'), year.toString());
  }

  query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, expenses) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        message: 'Error fetching expense data' 
      });
    }

    // Get total expense count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM expenses WHERE user_id = ?';
    let countParams = [userId];

    if (category) {
      countQuery += ' AND LOWER(category) LIKE LOWER(?)';
      countParams.push(`%${category}%`);
    }

    if (month && year) {
      countQuery += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
      countParams.push(month.toString().padStart(2, '0'), year.toString());
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error counting expense records' 
        });
      }

      res.json({
        success: true,
        expenses: expenses || [],
        pagination: {
          total: countResult.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < countResult.total
        }
      });
    });
  });
});

// Get expense by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.get(
    'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, expense) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error fetching expense' 
        });
      }

      if (!expense) {
        return res.status(404).json({ 
          error: 'Not found',
          message: 'Expense record not found' 
        });
      }

      res.json({
        success: true,
        expense
      });
    }
  );
});

// Update expense
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { category, amount, quantity = 1, description, date } = req.body;
});