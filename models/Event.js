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
    default: '/images/default-event.jpg',
    validate: {
      validator: function(v) {
        return /\.(jpg|jpeg|png|gif)$/.test(v);  // Ensures the image file has a valid format
      },
      message: props => `${props.value} is not a valid image format.`
    }
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ]
}, { timestamps: true });

// Ensure unique index on name
EventSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Event', EventSchema);
