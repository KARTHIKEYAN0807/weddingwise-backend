// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Get all events
router.get('/', eventController.getAllEvents);

// Get a single event by ID
router.get('/:id', eventController.getEventById);

// Create a new event
router.post('/', eventController.createEvent);

// Book an event
router.post('/book', eventController.bookEvent);

// Update an event
router.put('/:id', eventController.updateEvent);

// Delete an event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;