const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/bookings/confirm-booking
router.post('/confirm-booking', authMiddleware, bookingController.confirmBooking);

// GET /api/bookings
router.get('/', authMiddleware, bookingController.getUserBookings);

// GET /api/bookings/:id
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Catch-all route for invalid routes under /api/bookings
router.all('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Booking route not found' });
});

module.exports = router;
