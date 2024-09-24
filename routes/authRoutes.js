const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
