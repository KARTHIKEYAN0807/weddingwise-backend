const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true }, // The vendor's name
    description: { type: String },          // Description of the vendor's services
    img: { type: String },                  // Path to the vendor image
    // Add more fields as needed for vendor details
    // For example, contact information, services offered, etc.
});

module.exports = mongoose.model('Vendor', VendorSchema);
