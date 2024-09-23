const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const asyncHandler = require('express-async-handler'); // For async error handling

// Public routes (accessible by anyone)
router.get('/', asyncHandler(eventController.getAllEvents));         // Get all events (public)
router.get('/:id', asyncHandler(eventController.getEventById));      // Get event by ID (public)

// Protected routes for event booking (require authentication)
router.post('/book', authMiddleware, asyncHandler(eventController.bookEvent)); // Authenticated users can book an event
router.put('/bookings/:id', authMiddleware, asyncHandler(eventController.updateEventBooking)); // Authenticated users can update their event booking
router.delete('/bookings/:id', authMiddleware, asyncHandler(eventController.deleteEventBooking)); // Authenticated users can delete their event booking

// Admin-protected routes for event management (require both authentication and admin privileges)
router.post('/', [authMiddleware, adminMiddleware], asyncHandler(eventController.createEvent));   // Admin can create a new event
router.put('/:id', [authMiddleware, adminMiddleware], asyncHandler(eventController.updateEvent)); // Admin can update an existing event
router.delete('/:id', [authMiddleware, adminMiddleware], asyncHandler(eventController.deleteEvent)); // Admin can delete an event

// Catch-all route for undefined or invalid routes
router.all('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

module.exports = router;
