const mongoose = require('mongoose');

// Event schema definition
const EventSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Event name is required'],  // Event's name is required with a custom error message
        trim: true,                                  // Automatically trims any leading or trailing spaces
        unique: true,                                // Ensures the event name is unique
    },
    description: { 
        type: String, 
        trim: true,                                  // Trims spaces from description
        maxlength: 1000                              // Increased limit for description (up to 1000 characters)
    },
    img: { 
        type: String, 
        default: '/images/default-event.jpg',        // Provides a default image if none is supplied
        validate: {
            validator: function(value) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(value); // Basic URL validation for image
            },
            message: 'Please provide a valid image URL (jpg, jpeg, png, gif, webp).'
        }
    },
}, { timestamps: true });                            // Adds `createdAt` and `updatedAt` timestamps automatically

module.exports = mongoose.model('Event', EventSchema);
