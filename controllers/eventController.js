const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Helper functions for validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidFutureDate = (date) => !isNaN(Date.parse(date)) && new Date(date) > new Date();

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json({ status: 'success', data: events });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while fetching events' });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ status: 'error', msg: 'Invalid event ID format' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'error', msg: 'Event not found' });
        }
        res.json({ status: 'success', data: event });
    } catch (err) {
        console.error('Error fetching event by ID:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while fetching event' });
    }
};

// Book an event
exports.bookEvent = async (req, res) => {
    console.log('Booking event request body:', req.body);

    const { eventName, name, email, date, guests } = req.body;
    const userId = req.user ? req.user._id : null; // Assume req.user._id contains the logged-in user ID from auth middleware

    if (!userId) {
        return res.status(401).json({ status: 'error', msg: 'User authentication required' });
    }

    if (!eventName || !name || !email || !date || !guests) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ status: 'error', msg: 'All fields are required: eventName, name, email, date, and guests.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ status: 'error', msg: 'Please provide a valid email address.' });
    }

    if (!isValidFutureDate(date)) {
        return res.status(400).json({ status: 'error', msg: 'Please provide a valid date in the future.' });
    }

    try {
        const event = await Event.findOne({ name: eventName });
        if (!event) {
            return res.status(404).json({ status: 'error', msg: 'Event not found' });
        }

        const newEventBooking = new Booking({
            bookingType: 'Event',
            event: event._id,
            userId,
            name,
            email,
            date,
            guests,
            eventName: event.name,
        });

        const savedEventBooking = await newEventBooking.save();
        console.log('Event booking saved:', savedEventBooking);
        res.status(201).json({ status: 'success', data: savedEventBooking });
    } catch (err) {
        console.error('Error booking event:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while booking event' });
    }
};

// Update an event booking
exports.updateEventBooking = async (req, res) => {
    const eventBookingId = req.params.id;
    const { name, email, date, eventName, guests } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventBookingId)) {
        return res.status(400).json({ status: 'error', msg: 'Invalid event booking ID format' });
    }

    if (!name || !email || !date || !eventName || !guests) {
        return res.status(400).json({ status: 'error', msg: 'All fields are required: name, email, date, eventName, and guests.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ status: 'error', msg: 'Please provide a valid email address.' });
    }

    if (!isValidFutureDate(date)) {
        return res.status(400).json({ status: 'error', msg: 'Please provide a valid date in the future.' });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            eventBookingId,
            { name, email, date, eventName, guests },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ status: 'error', msg: 'Event booking not found' });
        }

        res.json({ status: 'success', data: updatedBooking });
    } catch (err) {
        console.error('Error updating event booking:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while updating event booking' });
    }
};

// Delete an event booking
exports.deleteEventBooking = async (req, res) => {
    const eventBookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventBookingId)) {
        return res.status(400).json({ status: 'error', msg: 'Invalid event booking ID format' });
    }

    try {
        const eventBooking = await Booking.findById(eventBookingId);
        if (!eventBooking) {
            return res.status(404).json({ status: 'error', msg: 'Event booking not found' });
        }

        await Booking.findByIdAndDelete(eventBookingId);
        res.json({ status: 'success', msg: 'Event booking deleted' });
    } catch (err) {
        console.error('Error deleting event booking:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while deleting event booking' });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    const { name, description, img } = req.body;

    if (!name || !description || !img) {
        return res.status(400).json({ status: 'error', msg: 'Event name, description, and image are required' });
    }

    try {
        const newEvent = new Event({ name, description, img });
        const savedEvent = await newEvent.save();
        res.status(201).json({ status: 'success', data: savedEvent });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while creating event' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const { name, description, img } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ status: 'error', msg: 'Invalid event ID format' });
    }

    if (!name || !description || !img) {
        return res.status(400).json({ status: 'error', msg: 'Event name, description, and image are required' });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { name, description, img },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ status: 'error', msg: 'Event not found' });
        }

        res.json({ status: 'success', data: updatedEvent });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while updating event' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ status: 'error', msg: 'Invalid event ID format' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ status: 'error', msg: 'Event not found' });
        }

        await Event.findByIdAndDelete(eventId);
        res.json({ status: 'success', msg: 'Event deleted' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ status: 'error', msg: 'Server error while deleting event' });
    }
};
