// backend/models/Vendor.js
const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    img: { type: String },
});

module.exports = mongoose.model('Vendor', VendorSchema);
