const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Confirm booking
router.post('/confirm-booking', authMiddleware, bookingController.confirmBooking);

module.exports = router;