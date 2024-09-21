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
        required: function() { return this.bookingType === 'Event'; }
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: function() { return this.bookingType === 'Vendor'; }
    },
    name: { // Changed from eventTitle to name
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    guests: {
        type: Number,
        required: function() { return this.bookingType === 'Event'; },
    },
    vendorName: {
        type: String,
        required: function() { return this.bookingType === 'Vendor'; },
    },
    date: {
        type: Date,
        required: function() { return this.bookingType === 'Vendor'; },
    },
}, { timestamps: true });

// Pre-save hook to ensure default values and validation
BookingSchema.pre('save', function(next) {
    if (this.bookingType === 'Event' && !this.name) { // Changed from eventTitle to name
        this.name = 'Untitled Event'; // Set default event name
    }
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);
