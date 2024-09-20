const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking'); // Use the Booking model

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ msg: 'Server error while fetching events' });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate the format of the ObjectId
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: 'Invalid event ID format' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ msg: 'Server error while fetching event' });
    }
};

// Book an event
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, name, email, guests, date } = req.body;

        // Validate input
        if (!eventId || !name || !email || !guests || !date) {
            return res.status(400).json({ msg: 'Please provide all required fields: eventId, name, email, guests, and date.' });
        }

        // Validate the event ID format
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: 'Invalid event ID format' });
        }

        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Create a new booking using the Booking model
        const newEventBooking = new Booking({
            bookingType: 'Event',
            event: event._id,
            name,
            email,
            guests,
            eventTitle: event.title, // Assigning event title
            date
        });

        const savedEventBooking = await newEventBooking.save();
        res.status(201).json(savedEventBooking);
    } catch (err) {
        console.error('Error booking event:', err);
        res.status(500).json({ msg: 'Server error while booking event' });
    }
};

// Delete an event booking
exports.deleteEventBooking = async (req, res) => {
    try {
        const eventBookingId = req.params.id;

        // Validate the eventBookingId
        if (!mongoose.Types.ObjectId.isValid(eventBookingId)) {
            return res.status(400).json({ msg: 'Invalid event booking ID format' });
        }

        const eventBooking = await Booking.findById(eventBookingId);
        if (!eventBooking) {
            return res.status(404).json({ msg: 'Event booking not found' });
        }

        await Booking.findByIdAndDelete(eventBookingId);
        res.status(200).json({ msg: 'Event booking deleted successfully' });
    } catch (err) {
        console.error('Error deleting event booking:', err);
        res.status(500).json({ msg: 'Server error while deleting event booking' });
    }
};

// Update an event booking
exports.updateEventBooking = async (req, res) => {
    try {
        const eventBookingId = req.params.id;
        const { name, email, date, eventTitle, guests } = req.body;

        // Validate the eventBookingId
        if (!mongoose.Types.ObjectId.isValid(eventBookingId)) {
            return res.status(400).json({ msg: 'Invalid event booking ID format' });
        }

        // Validate required fields
        if (!eventTitle || !name || !email || !date || !guests) {
            return res.status(400).json({ msg: 'Please provide all required fields: eventTitle, name, email, date, and guests.' });
        }

        // Update the event booking using the Booking model
        const updatedBooking = await Booking.findByIdAndUpdate(
            eventBookingId,
            { name, email, date, eventTitle, guests },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ msg: 'Event booking not found' });
        }

        res.status(200).json(updatedBooking);
    } catch (err) {
        console.error('Error updating event booking:', err);
        res.status(500).json({ msg: 'Server error while updating event booking' });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, img } = req.body;

        // Ensure title is present
        if (!title) {
            return res.status(400).json({ msg: 'Event title is required' });
        }

        // Create new event (Image is optional)
        const newEvent = new Event({ title, description, img });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ msg: 'Server error while creating event' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, img } = req.body;

        // Validate the format of the ObjectId
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: 'Invalid event ID format' });
        }

        // Validate required fields
        if (!title) {
            return res.status(400).json({ msg: 'Event title is required' });
        }

        // Update the event
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { title, description, img },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ msg: 'Server error while updating event' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate the eventId
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: 'Invalid event ID format' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ msg: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ msg: 'Server error while deleting event' });
    }
};
