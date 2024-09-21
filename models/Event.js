const mongoose = require('mongoose');

// Event schema definition
const EventSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Event name is required'],  // Event's name is required with a custom error message
        trim: true                                  // Automatically trims any leading or trailing spaces
    },
    description: { 
        type: String, 
        trim: true,                                 // Trims spaces from description
        maxlength: 500                              // Optional: Limits description to 500 characters
    },
    img: { 
        type: String, 
        default: '/images/default-event.jpg'        // Provides a default image if none is supplied
    },
}, { timestamps: true });                           // Adds `createdAt` and `updatedAt` timestamps automatically

module.exports = mongoose.model('Event', EventSchema);
