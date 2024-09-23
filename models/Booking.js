const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingType: {
        type: String,
        enum: ['Event', 'Vendor'],
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: function() { return this.bookingType === 'Event'; }
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: function() { return this.bookingType === 'Vendor'; }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    guests: {
        type: Number,
        required: function() { return this.bookingType === 'Event'; },
        min: [1, 'Guests must be at least 1']
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v >= new Date();  // Ensure the date is in the future
            },
            message: props => `The date ${props.value} cannot be in the past!`
        }
    },
}, { timestamps: true });

// Optionally add indexes to optimize query performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ event: 1 });
bookingSchema.index({ vendor: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
