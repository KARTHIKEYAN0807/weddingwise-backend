const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true
  },
  img: {
    type: String,
    default: '/images/default-vendor.jpg'
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
