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
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: 'Number of guests must be a positive number.',
        },
    },
    date: {
        type: Date,
        required: function () { return this.bookingType === 'Vendor' || this.bookingType === 'Event'; }, // Required for both
        validate: {
            validator: function(value) {
                return this.isNew ? value > Date.now() : true; // Only validate on creation, not updates
            },
            message: 'Booking date must be in the future.',
        },
    },
}, { timestamps: true });

// Set default name if it's an Event booking without a name
BookingSchema.pre('save', function (next) {
    if (this.bookingType === 'Event' && !this.name) {
        this.name = 'Untitled Event';
    }
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);
