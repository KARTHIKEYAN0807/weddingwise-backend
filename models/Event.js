const mongoose = require('mongoose');

// Event schema definition
const EventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Event title is required'], // Custom error message
        trim: true // Removes leading/trailing whitespace
    }, // The event's title
    description: { 
        type: String, 
        required: [true, 'Event description is required'], 
        trim: true
    }, // Description of the event
    date: { 
        type: Date, 
        required: [true, 'Event date is required'], 
        validate: {
            validator: (value) => value > new Date(),
            message: 'Event date must be in the future'
        }, // Ensures date is in the future
        index: true // Adds an index on the date field for performance
    }, // Date of the event
    location: { 
        type: String, 
        required: [true, 'Event location is required'], 
        trim: true 
    }, // Location of the event
    price: { 
        type: Number, 
        required: [true, 'Event price is required'], 
        min: [0, 'Event price must be a positive number'] // Validates that the price is positive
    }, // Price for the event
    img: { 
        type: String, 
        default: '/images/default-event.jpg' // Default image path if not provided
    }, // Path to the event image
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Event', EventSchema);
