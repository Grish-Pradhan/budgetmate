const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Add new income
router.post('/', (req, res) => {
  const { source, amount, date } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!source || !amount) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Source and amount are required' 
    });
  }

  if (amount <= 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Amount must be greater than 0' 
    });
  }

  const insertDate = date || new Date().toISOString();

  db.run(
    'INSERT INTO income (user_id, source, amount, date) VALUES (?, ?, ?, ?)',
    [userId, source, parseFloat(amount), insertDate],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error adding income' 
        });
      }

      res.status(201).json({
        success: true,
        message: 'Income added successfully',
        income: { 
          id: this.lastID, 
          source, 
          amount: parseFloat(amount),
          date: insertDate
        }
      });
    }
  );
});

// Get all income for user
router.get('/', (req, res) => {
  const userId = req.user.userId;
  const { month, year, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM income WHERE user_id = ?';
  let params = [userId];

  // Filter by month/year if provided
  if (month && year) {
    query += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
    params.push(month.toString().padStart(2, '0'), year.toString());
  }

  query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, incomes) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        message: 'Error fetching income data' 
      });
    }

    // Get total income count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM income WHERE user_id = ?';
    let countParams = [userId];

    if (month && year) {
      countQuery += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
      countParams.push(month.toString().padStart(2, '0'), year.toString());
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error counting income records' 
        });
      }

      res.json({
        success: true,
        incomes: incomes || [],
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

// Get income by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.get(
    'SELECT * FROM income WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, income) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error fetching income' 
        });
      }

      if (!income) {
        return res.status(404).json({ 
          error: 'Not found',
          message: 'Income record not found' 
        });
      }

      res.json({
        success: true,
        income
      });
    }
  );
});

// Update income
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { source, amount, date } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!source || !amount) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Source and amount are required' 
    });
  }

  if (amount <= 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      message: 'Amount must be greater than 0' 
    });
  }

  const updateDate = date || new Date().toISOString();

  db.run(
    'UPDATE income SET source = ?, amount = ?, date = ? WHERE id = ? AND user_id = ?',
    [source, parseFloat(amount), updateDate, id, userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error updating income' 
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ 
          error: 'Not found',
          message: 'Income record not found' 
        });
      }

      res.json({
        success: true,
        message: 'Income updated successfully',
        income: { 
          id: parseInt(id), 
          source, 
          amount: parseFloat(amount),
          date: updateDate
        }
      });
    }
  );
});

// Delete income
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.run(
    'DELETE FROM income WHERE id = ? AND user_id = ?',
    [id, userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error deleting income' 
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ 
          error: 'Not found',
          message: 'Income record not found' 
        });
      }

      res.json({
        success: true,
        message: 'Income deleted successfully'
      });
    }
  );
});

// Get total income for user
router.get('/stats/total', (req, res) => {
  const userId = req.user.userId;
  const { month, year } = req.query;

  let query = 'SELECT SUM(amount) as total FROM income WHERE user_id = ?';
  let params = [userId];

  if (month && year) {
    query += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
    params.push(month.toString().padStart(2, '0'), year.toString());
  }

  db.get(query, params, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        message: 'Error calculating total income' 
      });
    }

    res.json({
      success: true,
      total: result.total || 0
    });
  });
});

module.exports = router;