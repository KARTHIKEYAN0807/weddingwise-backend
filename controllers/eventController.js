const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

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

        // Validate the event ID format
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

// Book an event using the event ID
exports.bookEvent = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log incoming request body for debugging

        const { eventId, name, email, guests } = req.body;

        // Validate input fields
        if (!eventId || !name || !email || !guests) {
            console.log('Missing fields:', { eventId, name, email, guests });
            return res.status(400).json({ msg: 'Please provide all required fields: eventId, name, email, and guests.' });
        }

        // Ensure guests is a valid number
        const parsedGuests = parseInt(guests, 10);
        if (isNaN(parsedGuests) || parsedGuests <= 0) {
            console.log('Invalid guests number:', guests);
            return res.status(400).json({ msg: 'Guests must be a valid positive number.' });
        }

        // Validate event ID format
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: 'Invalid event ID format' });
        }

        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            console.log('Event not found:', eventId);
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Create a new booking
        const newEventBooking = new Booking({
            bookingType: 'Event',
            event: event._id,
            name,
            email,
            guests: parsedGuests,
            eventTitle: event.title, // Store the event title from the found event
        });

        const savedEventBooking = await newEventBooking.save();
        console.log('Booking saved:', savedEventBooking); // Log saved booking
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
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: 'Invalid event ID format' });
        }

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
        console.error('Error deleting event:', err.message || err);
        res.status(500).json({ msg: 'Server error while deleting event' });
    }
};
