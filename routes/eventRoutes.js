const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Assuming you have an admin check middleware

// Public Event Routes
router.get('/', eventController.getAllEvents); // Get all events
router.get('/:id', eventController.getEventById); // Get a single event by ID

// Event Booking Routes (Requires user to be authenticated)
router.post('/book', authMiddleware, eventController.bookEvent); // Book an event
router.put('/bookings/:id', authMiddleware, eventController.updateEventBooking); // Update a booking
router.delete('/bookings/:id', authMiddleware, eventController.deleteEventBooking); // Delete a booking

// Admin Routes (Create, Update, Delete events - Requires admin privileges)
router.post('/', authMiddleware, adminMiddleware, eventController.createEvent); // Create a new event (Admin)
router.put('/:id', authMiddleware, adminMiddleware, eventController.updateEvent); // Update an event (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, eventController.deleteEvent); // Delete an event (Admin)

// Catch-all for invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
