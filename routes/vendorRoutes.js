const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');  // Correct import
const authMiddleware = require('../middleware/authMiddleware');

// Vendor management routes (admin access required)
router.get('/', vendorController.getAllVendors);                        // Public: Get all vendors
router.get('/:id', vendorController.getVendorById);                     // Public: Get a single vendor by ID
router.post('/', authMiddleware, vendorController.createVendor);        // Protected: Admin - Create a new vendor
router.put('/:id', authMiddleware, vendorController.updateVendor);      // Protected: Admin - Update vendor by ID
router.delete('/:id', authMiddleware, vendorController.deleteVendor);   // Protected: Admin - Delete vendor by ID

// Vendor booking routes (requires user authentication)
router.post('/book', authMiddleware, vendorController.bookVendor);                  // Protected: User - Book a vendor
router.put('/bookings/:id', authMiddleware, vendorController.updateVendorBooking);  // Protected: User - Update vendor booking by ID
router.delete('/bookings/:id', authMiddleware, vendorController.deleteVendorBooking); // Protected: User - Delete vendor booking by ID

// Fetch all bookings for a specific vendor (vendorId as a query parameter)
router.get('/bookings', vendorController.getVendorBookings);  // Public/Protected: Get all bookings for a vendor based on vendorId

module.exports = router;
