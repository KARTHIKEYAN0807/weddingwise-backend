const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Constants for HTTP status codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    UNAUTHORIZED: 401
};

// Helper functions for validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidFutureDate = (date) => !isNaN(Date.parse(date)) && new Date(date) > new Date();

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: events });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while fetching events' });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid event ID format' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Event not found' });
        }
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: event });
    } catch (err) {
        console.error('Error fetching event by ID:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while fetching event' });
    }
};

// Add event to cart (not confirmed yet)
exports.addEventToCart = async (req, res) => {
    const { eventName, name, email, date, guests } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: 'error', msg: 'User authentication required' });
    }

    if (!eventName || !name || !email || !date || !guests) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'All fields are required: eventName, name, email, date, and guests.' });
    }

    if (!isValidEmail(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid email address.' });
    }

    if (!isValidFutureDate(date)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid date in the future.' });
    }

    try {
        const event = await Event.findOne({ name: eventName });
        if (!event) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Event not found' });
        }

        const newCartBooking = new Booking({
            bookingType: 'Event',
            event: event._id,
            userId,
            name,
            email,
            date,
            guests,
            eventName: event.name,
            status: 'cart' // Initially add to cart
        });

        const savedCartBooking = await newCartBooking.save();
        res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: savedCartBooking });
    } catch (err) {
        console.error('Error adding event to cart:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while adding event to cart' });
    }
};

// Confirm event booking (finalize booking from cart)
exports.confirmEventBooking = async (req, res) => {
    const eventBookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventBookingId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid event booking ID format' });
    }

    try {
        const eventBooking = await Booking.findById(eventBookingId);

        if (!eventBooking || eventBooking.status !== 'cart') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Cart booking not found' });
        }

        // Update the booking status to confirmed
        eventBooking.status = 'confirmed';
        const confirmedBooking = await eventBooking.save();

        res.status(HTTP_STATUS.OK).json({ status: 'success', data: confirmedBooking });
    } catch (err) {
        console.error('Error confirming event booking:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while confirming event booking' });
    }
};

// Update an event booking
exports.updateEventBooking = async (req, res) => {
    const eventBookingId = req.params.id;
    const { name, email, date, eventName, guests } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventBookingId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid event booking ID format' });
    }

    if (!name || !email || !date || !eventName || !guests) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'All fields are required: name, email, date, eventName, and guests.' });
    }

    if (!isValidEmail(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid email address.' });
    }

    if (!isValidFutureDate(date)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid date in the future.' });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            eventBookingId,
            { name, email, date, eventName, guests },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Event booking not found' });
        }

        res.status(HTTP_STATUS.OK).json({ status: 'success', data: updatedBooking });
    } catch (err) {
        console.error('Error updating event booking:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while updating event booking' });
    }
};

// Delete an event booking
exports.deleteEventBooking = async (req, res) => {
    const eventBookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventBookingId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid event booking ID format' });
    }

    try {
        const eventBooking = await Booking.findById(eventBookingId);
        if (!eventBooking) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Event booking not found' });
        }

        await Booking.findByIdAndDelete(eventBookingId);
        res.status(HTTP_STATUS.OK).json({ status: 'success', msg: 'Event booking deleted' });
    } catch (err) {
        console.error('Error deleting event booking:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while deleting event booking' });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    const { name, description, img } = req.body;

    if (!name || !description || !img) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Event name, description, and image are required' });
    }

    try {
        const newEvent = new Event({ name, description, img });
        const savedEvent = await newEvent.save();
        res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: savedEvent });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while creating event' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const { name, description, img } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid event ID format' });
    }

    if (!name || !description || !img) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Event name, description, and image are required' });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { name, description, img },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Event not found' });
        }

        res.status(HTTP_STATUS.OK).json({ status: 'success', data: updatedEvent });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while updating event' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid event ID format' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Event not found' });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(HTTP_STATUS.OK).json({ status: 'success', msg: 'Event deleted' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while deleting event' });
    }
};
