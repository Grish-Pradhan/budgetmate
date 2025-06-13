const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const auth = require('../middleware/authMiddleware'); // your auth middleware to protect routes

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', auth, controller.logout);
router.delete('/user/:id', auth, controller.deleteUser);

module.exports = router;
