const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', eventController.getAllEvents);          // Get all events
router.get('/:id', eventController.getEventById);       // Get event by ID

// Protected routes for event booking
router.post('/book', authMiddleware, eventController.bookEvent); // Book an event
router.put('/bookings/:id', authMiddleware, eventController.updateEventBooking); // Update event booking
router.delete('/bookings/:id', authMiddleware, eventController.deleteEventBooking); // Delete event booking

// Admin-protected routes for event management
router.post('/', [authMiddleware, adminMiddleware], eventController.createEvent);   // Admin: Create event
router.put('/:id', [authMiddleware, adminMiddleware], eventController.updateEvent); // Admin: Update event
router.delete('/:id', [authMiddleware, adminMiddleware], eventController.deleteEvent); // Admin: Delete event

// Handle invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
