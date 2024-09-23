const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  img: {
    type: String,
    default: '/images/default-event.jpg'
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
