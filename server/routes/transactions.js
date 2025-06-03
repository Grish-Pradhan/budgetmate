const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', controller.getTransactions);
router.post('/', controller.addTransaction);
router.delete('/:id', controller.deleteTransaction);
router.get('/report/summary', controller.getReport);

module.exports = router;
