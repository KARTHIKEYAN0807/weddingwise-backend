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

// GET /api/bookings/:id
// Fetch a specific booking by its ID. Requires user authentication.
router.get('/bookings/:id', authMiddleware, bookingController.getBookingById);

// Catch-all route for invalid routes
router.all('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

module.exports = router;
