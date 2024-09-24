const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
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
        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ msg: 'Server error while fetching event' });
    }
};

// Book an event
exports.bookEvent = async (req, res) => {
    try {
        const { title, name, email, guests } = req.body; // Use title directly

        // Validate input
        if (!title || !name || !email || !guests) {
            return res.status(400).json({ msg: 'Please provide all required fields: title, name, email, and guests.' });
        }

        // Find the event by title
        const event = await Event.findOne({ title });
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
            eventTitle: event.title, // Title from the event
        });

        const savedEventBooking = await newEventBooking.save();
        res.status(201).json(savedEventBooking);
    } catch (err) {
        console.error('Error booking event:', err);
        res.status(500).json({ msg: 'Server error while booking event' });
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

        // Create new event
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

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Update the event
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { title, description, img },
            { new: true, runValidators: true }
        );
        res.json(updatedEvent);
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
        res.json({ msg: 'Event deleted' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ msg: 'Server error while deleting event' });
    }
};
