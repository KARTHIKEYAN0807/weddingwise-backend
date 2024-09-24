const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');

// Constants for HTTP status codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
};

// Get all vendor bookings for authenticated user
exports.getAllVendorBookings = async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming user ID from auth middleware
        const bookings = await Booking.find({ userId, bookingType: 'Vendor' }).populate('vendor');
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: bookings });
    } catch (err) {
        console.error('Error fetching vendor bookings:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while fetching vendor bookings' });
    }
};

// Add vendor to cart (unconfirmed booking)
exports.addVendorToCart = async (req, res) => {
    const { vendorName, name, email, date, userId } = req.body;

    if (!vendorName || !name || !email || !date || !userId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'All fields are required: vendorName, name, email, date, and userId.' });
    }

    if (!isValidEmail(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid email address.' });
    }

    if (!isValidFutureDate(date)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid date in the future.' });
    }

    try {
        const vendor = await Vendor.findOne({ name: vendorName });
        if (!vendor) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Vendor not found' });
        }

        const newVendorBooking = new Booking({
            bookingType: 'Vendor',
            vendor: vendor._id,
            userId,
            name,
            email,
            date,
            vendorName: vendor.name,
            status: 'cart', // Initially set the status to cart
        });

        const savedVendorBooking = await newVendorBooking.save();
        res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: savedVendorBooking });
    } catch (err) {
        console.error('Error adding vendor to cart:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while adding vendor to cart' });
    }
};

// Confirm vendor booking (finalize booking from cart)
exports.confirmVendorBooking = async (req, res) => {
    const vendorBookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(vendorBookingId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid vendor booking ID format' });
    }

    try {
        const vendorBooking = await Booking.findById(vendorBookingId);

        if (!vendorBooking || vendorBooking.status !== 'cart') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Cart booking not found' });
        }

        vendorBooking.status = 'confirmed';
        const confirmedBooking = await vendorBooking.save();
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: confirmedBooking });
    } catch (err) {
        console.error('Error confirming vendor booking:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while confirming vendor booking' });
    }
};

// Update a vendor booking
exports.updateVendorBooking = async (req, res) => {
    const vendorBookingId = req.params.id;
    const { name, email, date, vendorName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendorBookingId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid vendor booking ID format' });
    }

    if (!name || !email || !date || !vendorName) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'All fields are required: name, email, date, and vendorName.' });
    }

    if (!isValidEmail(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid email address.' });
    }

    if (!isValidFutureDate(date)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Please provide a valid date in the future.' });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            vendorBookingId,
            { name, email, date, vendorName },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Vendor booking not found' });
        }

        res.status(HTTP_STATUS.OK).json({ status: 'success', data: updatedBooking });
    } catch (err) {
        console.error('Error updating vendor booking:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while updating vendor booking' });
    }
};

// Delete a vendor booking
exports.deleteVendorBooking = async (req, res) => {
    const vendorBookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(vendorBookingId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid vendor booking ID format' });
    }

    try {
        const vendorBooking = await Booking.findById(vendorBookingId);
        if (!vendorBooking) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Vendor booking not found' });
        }

        await Booking.findByIdAndDelete(vendorBookingId);
        res.status(HTTP_STATUS.OK).json({ status: 'success', msg: 'Vendor booking deleted' });
    } catch (err) {
        console.error('Error deleting vendor booking:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while deleting vendor booking' });
    }
};
