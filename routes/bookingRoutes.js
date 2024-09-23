const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/bookings/confirm-booking
// Confirm event and vendor bookings. Requires user authentication.
router.post('/confirm-booking', authMiddleware, bookingController.confirmBooking);

// GET /api/bookings
// Fetch all bookings (events and vendors) for the authenticated user.
router.get('/bookings', authMiddleware, bookingController.getUserBookings);

module.exports = router;
