const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Assuming you have middleware for admin check

// Public Vendor Routes
router.get('/', vendorController.getAllVendors); // Get all vendors
router.get('/:id', vendorController.getVendorById); // Get a single vendor by ID

// Vendor Booking Routes (Requires user to be authenticated)
router.post('/book', authMiddleware, vendorController.bookVendor); // Book a vendor
router.put('/bookings/:id', authMiddleware, vendorController.updateVendorBooking); // Update a booking
router.delete('/bookings/:id', authMiddleware, vendorController.deleteVendorBooking); // Delete a booking

// Admin Routes (Create, Update, Delete vendors - Requires admin privileges)
router.post('/', authMiddleware, adminMiddleware, vendorController.createVendor); // Create a new vendor (Admin)
router.put('/:id', authMiddleware, adminMiddleware, vendorController.updateVendor); // Update a vendor (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, vendorController.deleteVendor); // Delete a vendor (Admin)

// Catch-all for invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
