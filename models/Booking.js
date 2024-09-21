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
    name: { // Use 'name' for both events and vendors
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    guests: {
        type: Number,
        required: function () { return this.bookingType === 'Event'; }, // Guests only required for events
    },
    date: {
        type: Date,
        required: function () { return this.bookingType === 'Vendor'; }, // Date only required for vendor bookings
    },
}, { timestamps: true });

// Pre-save hook for default values if necessary
BookingSchema.pre('save', function (next) {
    if (this.bookingType === 'Event' && !this.name) {
        this.name = 'Untitled Event'; // Default name if none is provided for events
    }
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);
