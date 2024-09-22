const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');

// Get all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (err) {
        console.error('Error fetching vendors:', err);
        res.status(500).json({ msg: 'Server error while fetching vendors' });
    }
};

// Get a single vendor by ID
exports.getVendorById = async (req, res) => {
    try {
        const vendorId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ msg: 'Invalid vendor ID format' });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
        }
        res.json(vendor);
    } catch (err) {
        console.error('Error fetching vendor:', err);
        res.status(500).json({ msg: 'Server error while fetching vendor' });
    }
};

// Book a vendor
exports.bookVendor = async (req, res) => {
    try {
        const { vendorName, name, email, date } = req.body;

        // Validate input
        if (!vendorName || !name || !email || !date) {
            return res.status(400).json({ msg: 'All fields are required: vendorName, name, email, and date.' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Please provide a valid email address.' });
        }

        // Validate the date format
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ msg: 'Please provide a valid date.' });
        }

        // Find the vendor by name
        const vendor = await Vendor.findOne({ name: vendorName });
        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
        }

        // Create a new booking using the Booking model
        const newVendorBooking = new Booking({
            bookingType: 'Vendor',
            vendor: vendor._id,
            name,
            email,
            date,
            vendorName: vendor.name,
        });

        const savedVendorBooking = await newVendorBooking.save();
        res.status(201).json(savedVendorBooking);
    } catch (err) {
        console.error('Error booking vendor:', err);
        res.status(500).json({ msg: 'Server error while booking vendor' });
    }
};

// Delete a vendor booking
exports.deleteVendorBooking = async (req, res) => {
    try {
        const vendorBookingId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(vendorBookingId)) {
            return res.status(400).json({ msg: 'Invalid vendor booking ID format' });
        }

        const vendorBooking = await Booking.findById(vendorBookingId);
        if (!vendorBooking) {
            return res.status(404).json({ msg: 'Vendor booking not found' });
        }

        await Booking.findByIdAndDelete(vendorBookingId);
        res.json({ msg: 'Vendor booking deleted' });
    } catch (err) {
        console.error('Error deleting vendor booking:', err);
        res.status(500).json({ msg: 'Server error while deleting vendor booking' });
    }
};

// Update a vendor booking
exports.updateVendorBooking = async (req, res) => {
    try {
        const vendorBookingId = req.params.id;
        const { name, email, date, vendorName } = req.body;

        // Validate the vendorBookingId
        if (!mongoose.Types.ObjectId.isValid(vendorBookingId)) {
            return res.status(400).json({ msg: 'Invalid vendor booking ID format' });
        }

        // Validate input
        if (!name || !email || !date || !vendorName) {
            return res.status(400).json({ msg: 'All fields are required: name, email, date, vendorName.' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Please provide a valid email address.' });
        }

        // Validate the date format
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ msg: 'Please provide a valid date.' });
        }

        // Find and update the vendor booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            vendorBookingId,
            { name, email, date, vendorName },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ msg: 'Vendor booking not found' });
        }

        res.json(updatedBooking);
    } catch (err) {
        console.error('Error updating vendor booking:', err);
        res.status(500).json({ msg: 'Server error while updating vendor booking' });
    }
};

// Create a new vendor
exports.createVendor = async (req, res) => {
    try {
        const { name, description, img } = req.body;

        if (!name) {
            return res.status(400).json({ msg: 'Vendor name is required' });
        }

        const newVendor = new Vendor({ name, description, img });
        const savedVendor = await newVendor.save();
        res.status(201).json(savedVendor);
    } catch (err) {
        console.error('Error creating vendor:', err);
        res.status(500).json({ msg: 'Server error while creating vendor' });
    }
};

// Update a vendor
exports.updateVendor = async (req, res) => {
    try {
        const vendorId = req.params.id;
        const { name, description, img } = req.body;

        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ msg: 'Invalid vendor ID format' });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { name, description, img },
            { new: true, runValidators: true }
        );
        res.json(updatedVendor);
    } catch (err) {
        console.error('Error updating vendor:', err);
        res.status(500).json({ msg: 'Server error while updating vendor' });
    }
};

// Delete a vendor
exports.deleteVendor = async (req, res) => {
    try {
        const vendorId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ msg: 'Invalid vendor ID format' });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
        }

        await Vendor.findByIdAndDelete(vendorId);
        res.json({ msg: 'Vendor deleted' });
    } catch (err) {
        console.error('Error deleting vendor:', err);
        res.status(500).json({ msg: 'Server error while deleting vendor' });
    }
};
