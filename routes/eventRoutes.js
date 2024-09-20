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
router.put('/bookings/:id', eventController.updateEventBooking); // Update event booking
router.delete('/bookings/:id', eventController.deleteEventBooking); // Delete event booking

module.exports = router;
