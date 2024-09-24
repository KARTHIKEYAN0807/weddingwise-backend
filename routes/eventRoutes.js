const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler'); // For async error handling

// Public routes (accessible by anyone)
router.get('/', asyncHandler(eventController.getAllEvents));         // Get all events (public)
router.get('/:id', asyncHandler(eventController.getEventById));      // Get event by ID (public)

// Protected routes for event booking and event management (require authentication)
router.post('/book', authMiddleware, asyncHandler(eventController.bookEvent)); // Authenticated users can book an event
router.put('/bookings/:id', authMiddleware, asyncHandler(eventController.updateEventBooking)); // Authenticated users can update their event booking
router.delete('/bookings/:id', authMiddleware, asyncHandler(eventController.deleteEventBooking)); // Authenticated users can delete their event booking

// Event management (accessible by all authenticated users)
router.post('/', authMiddleware, asyncHandler(eventController.createEvent));   // Authenticated users can create a new event
router.put('/:id', authMiddleware, asyncHandler(eventController.updateEvent)); // Authenticated users can update an existing event
router.delete('/:id', authMiddleware, asyncHandler(eventController.deleteEvent)); // Authenticated users can delete an event

// Catch-all route for undefined or invalid routes
router.all('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

module.exports = router;
