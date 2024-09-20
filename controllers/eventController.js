const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Helper to validate ObjectId
const validateObjectId = (id, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ msg: 'Invalid ID format' });
        return false;
    }
    return true;
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err.message || err);
        res.status(500).json({ msg: 'Server error while fetching events' });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate the event ID format
        if (!validateObjectId(eventId, res)) return;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (err) {
        console.error('Error fetching event:', err.message || err);
        res.status(500).json({ msg: 'Server error while fetching event' });
    }
};

// Book an event using the event ID
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, name, email, guests } = req.body;

        // Validate input fields
        if (!eventId || !name || !email || !guests) {
            return res.status(400).json({ msg: 'All fields are required: eventId, name, email, and guests.' });
        }

        // Ensure guests is a valid number
        const parsedGuests = parseInt(guests, 10);
        if (isNaN(parsedGuests) || parsedGuests <= 0) {
            return res.status(400).json({ msg: 'Guests must be a valid positive number.' });
        }

        // Validate event ID format
        if (!validateObjectId(eventId, res)) return;

        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Create a new booking
        const newEventBooking = new Booking({
            bookingType: 'Event',
            event: event._id,
            name,
            email,
            guests: parsedGuests,
            eventTitle: event.title,
        });

        const savedEventBooking = await newEventBooking.save();
        res.status(201).json(savedEventBooking);
    } catch (err) {
        console.error('Error booking event:', err.message || err);
        res.status(500).json({ msg: 'Server error while booking event' });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, img } = req.body;

        // Validate required fields
        if (!title || !img) {
            return res.status(400).json({ msg: 'Event title and image URL are required.' });
        }

        const newEvent = new Event({ title, description, img });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error creating event:', err.message || err);
        res.status(500).json({ msg: 'Server error while creating event' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, img } = req.body;

        // Validate required fields
        if (!title || !img) {
            return res.status(400).json({ msg: 'Event title and image URL are required.' });
        }

        // Validate the event ID format
        if (!validateObjectId(eventId, res)) return;

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { title, description, img },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ msg: 'Event not found or failed to update.' });
        }

        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error('Error updating event:', err.message || err);
        res.status(500).json({ msg: 'Server error while updating event' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate the event ID format
        if (!validateObjectId(eventId, res)) return;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ msg: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err.message || err);
        res.status(500).json({ msg: 'Server error while deleting event' });
    }
};
