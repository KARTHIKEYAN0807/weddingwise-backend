const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/bookings/confirm-booking
// Route to confirm both event and vendor bookings for an authenticated user
router.post('/confirm-booking', authMiddleware, bookingController.confirmBooking);

// GET /api/bookings
// Route to fetch all bookings for the authenticated user
router.get('/', authMiddleware, bookingController.getUserBookings);

// GET /api/bookings/:id
// Route to fetch a specific booking by its ID for the authenticated user
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Handle all invalid routes under /api/bookings
// Returns a 404 error for routes that do not exist
router.all('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Booking route not found' });
});

module.exports = router;
