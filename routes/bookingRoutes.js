const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware

// POST /confirm-booking
// This route confirms event and vendor bookings. Requires authentication.
router.post('/confirm-booking', authMiddleware, bookingController.confirmBooking);

module.exports = router;
