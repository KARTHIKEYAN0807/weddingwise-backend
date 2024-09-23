const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Corrected import

// Event management routes (public)
router.get('/', eventController.getAllEvents);          // Public: Get all events
router.get('/:id', eventController.getEventById);       // Public: Get a single event by ID

// Event booking routes (protected for authenticated users)
router.post('/book', authMiddleware, eventController.bookEvent); // Protected: Book an event
router.put('/bookings/:id', authMiddleware, eventController.updateEventBooking); // Protected: Update event booking
router.delete('/bookings/:id', authMiddleware, eventController.deleteEventBooking); // Protected: Delete event booking

// Event creation, update, delete (Admin protected routes)
router.post('/', [authMiddleware, adminMiddleware], eventController.createEvent);   // Admin: Create an event
router.put('/:id', [authMiddleware, adminMiddleware], eventController.updateEvent); // Admin: Update an event
router.delete('/:id', [authMiddleware, adminMiddleware], eventController.deleteEvent); // Admin: Delete an event

// Handle invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
