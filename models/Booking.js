// backend/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookingType: {
        type: String,
        enum: ['Event', 'Vendor'],
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: function () { return this.bookingType === 'Event'; }
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: function () { return this.bookingType === 'Vendor'; }
    },
    name: { 
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.'],
    },
    guests: {
        type: Number,
        required: function () { return this.bookingType === 'Event'; },
    },
    date: {
        type: Date,
        required: function () { return this.bookingType === 'Vendor'; },
        validate: {
            validator: function(value) {
                return value >= Date.now();
            },
            message: 'Booking date must be in the future.'
        }
    },
}, { timestamps: true });

BookingSchema.pre('save', function (next) {
    if (this.bookingType === 'Event' && !this.name) {
        this.name = 'Untitled Event';
    }
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);
