const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    }, // The event's title
    description: { 
        type: String 
    }, // Description of the event
    img: { 
        type: String 
    }, // Path to the event image
    // Add more fields as needed for event details
});

module.exports = mongoose.model('Event', EventSchema);
