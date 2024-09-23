const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');

// Constants for HTTP status codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

// Helper functions for validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidFutureDate = (date) => !isNaN(Date.parse(date)) && new Date(date) > new Date();

// Get all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: vendors });
    } catch (err) {
        console.error('Error fetching vendors:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while fetching vendors' });
    }
};

// Get a single vendor by ID
exports.getVendorById = async (req, res) => {
    const vendorId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid vendor ID format' });
    }

    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Vendor not found' });
        }
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: vendor });
    } catch (err) {
        console.error('Error fetching vendor:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while fetching vendor' });
    }
};

// Book a vendor
exports.bookVendor = async (req, res) => {
    const { vendorName, name, email, date, userId } = req.body;

    if (!vendorName || !name || !email || !date || !userId) {
        console.error('Missing required fields:', req.body);
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
        });

        const savedVendorBooking = await newVendorBooking.save();
        res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: savedVendorBooking });
    } catch (err) {
        console.error('Error booking vendor:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while booking vendor' });
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

// Create a new vendor
exports.createVendor = async (req, res) => {
    const { name, description, img } = req.body;

    if (!name) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Vendor name is required' });
    }

    try {
        const newVendor = new Vendor({ name, description, img });
        const savedVendor = await newVendor.save();
        res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: savedVendor });
    } catch (err) {
        console.error('Error creating vendor:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while creating vendor' });
    }
};

// Update a vendor
exports.updateVendor = async (req, res) => {
    const vendorId = req.params.id;
    const { name, description, img } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid vendor ID format' });
    }

    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Vendor not found' });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { name, description, img },
            { new: true, runValidators: true }
        );
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: updatedVendor });
    } catch (err) {
        console.error('Error updating vendor:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while updating vendor' });
    }
};

// Delete a vendor
exports.deleteVendor = async (req, res) => {
    const vendorId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', msg: 'Invalid vendor ID format' });
    }

    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'error', msg: 'Vendor not found' });
        }

        await Vendor.findByIdAndDelete(vendorId);
        res.status(HTTP_STATUS.OK).json({ status: 'success', msg: 'Vendor deleted' });
    } catch (err) {
        console.error('Error deleting vendor:', err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ status: 'error', msg: 'Server error while deleting vendor' });
    }
};
