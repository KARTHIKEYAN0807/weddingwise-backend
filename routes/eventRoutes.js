const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Get all events
router.get('/', eventController.getAllEvents);

// Get a single event by ID
router.get('/:id', eventController.getEventById);

// Create a new event
router.post('/', eventController.createEvent);

// Book an event by passing the event ID in the URL
router.post('/book/:id', eventController.bookEvent);

// Update an event by passing the event ID
router.put('/:id', eventController.updateEvent);

// Delete an event by passing the event ID
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
