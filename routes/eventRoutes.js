const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// Event management routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Event booking routes
router.post('/book', authMiddleware, eventController.bookEvent);
router.put('/bookings/:id', authMiddleware, eventController.updateEventBooking);
router.delete('/bookings/:id', authMiddleware, eventController.deleteEventBooking);

// Event creation, update, delete (Admin)
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);

// Handle invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
