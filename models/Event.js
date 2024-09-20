const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    }, // The event's title
    description: { 
        type: String, 
        required: true 
    }, // Description of the event
    date: { 
        type: Date, 
        required: true 
    }, // Date of the event
    location: { 
        type: String, 
        required: true 
    }, // Location of the event
    price: { 
        type: Number, 
        required: true 
    }, // Price for the event
    img: { 
        type: String 
    }, // Path to the event image
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Event', EventSchema);
