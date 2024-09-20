const mongoose = require('mongoose');

// Event schema definition, simplified like Vendor schema
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },        // Event's title, required like vendor's name
    description: { type: String },                  // Event's description, similar to vendor's description
    img: { type: String },                          // Path to the event image, like vendor's image
    // You can add more fields here if needed, similar to how vendors have extra details
});

// Export the Event model
module.exports = mongoose.model('Event', EventSchema);
