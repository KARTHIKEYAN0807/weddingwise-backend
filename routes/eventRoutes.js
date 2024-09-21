const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Event management routes
router.get('/', eventController.getAllEvents);          // Get all events
router.get('/:id', eventController.getEventById);       // Get a single event by ID
router.post('/', eventController.createEvent);          // Create a new event
router.put('/:id', eventController.updateEvent);        // Update an event
router.delete('/:id', eventController.deleteEvent);     // Delete an event

// Event booking routes
router.post('/book', eventController.bookEvent);                 // Book an event
router.put('/bookings/:id', eventController.updateEventBooking); // Update event booking by ID
router.delete('/bookings/:id', eventController.deleteEventBooking); // Delete event booking by ID

// Error handling for invalid routes (optional)
router.all('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = router;
