const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Log the bookingController to verify function availability
console.log('Booking Controller:', bookingController);

// POST /api/bookings/confirm-booking
// Confirm event and vendor bookings for the authenticated user.
router.post('/confirm-booking', authMiddleware, bookingController.confirmBooking);

// GET /api/bookings
// Fetch all bookings (events and vendors) for the authenticated user.
router.get('/', authMiddleware, bookingController.getUserBookings);

// GET /api/bookings/:id
// Fetch a specific booking by its ID for the authenticated user.
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Catch-all route for invalid routes under /api/bookings
router.all('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Booking route not found' });
});

// Export the router
module.exports = router;
