const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// Event management routes (accessible publicly)
router.get('/', eventController.getAllEvents);          // Get all events
router.get('/:id', eventController.getEventById);       // Get a single event by ID

// Protected routes for event management (requires authentication)
router.post('/', authMiddleware, eventController.createEvent);   // Create a new event (Protected)
router.put('/:id', authMiddleware, eventController.updateEvent); // Update an event (Protected)
router.delete('/:id', authMiddleware, eventController.deleteEvent); // Delete an event (Protected)

// Event booking routes (booking generally requires authentication)
router.post('/book', authMiddleware, eventController.bookEvent); // Book an event
router.put('/bookings/:id', authMiddleware, eventController.updateEventBooking); // Update event booking by ID
router.delete('/bookings/:id', authMiddleware, eventController.deleteEventBooking); // Delete event booking by ID

// Error handling for invalid routes
router.all('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = router;
