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
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
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
    },
    guests: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
