const db = require('../models/db');

exports.getTransactions = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM transactions WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.addTransaction = (req, res) => {
  const { title, amount, type } = req.body;
  const userId = req.user.id;
  const query = 'INSERT INTO transactions (title, amount, type, user_id) VALUES (?, ?, ?, ?)';
  db.query(query, [title, amount, type, userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, title, amount, type });
  });
};

exports.deleteTransaction = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.getReport = (req, res) => {
  const userId = req.user.id;
  const query = `SELECT type, SUM(amount) AS total FROM transactions WHERE user_id = ? GROUP BY type`;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};
