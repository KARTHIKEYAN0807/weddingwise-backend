const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

// Vendor management routes (protected, requires admin/authentication)
router.get('/', vendorController.getAllVendors);                        // Get all vendors (can be public)
router.get('/:id', vendorController.getVendorById);                     // Get a single vendor by ID (can be public)
router.post('/', authMiddleware, vendorController.createVendor);        // Create a new vendor (Protected)
router.put('/:id', authMiddleware, vendorController.updateVendor);      // Update vendor (Protected)
router.delete('/:id', authMiddleware, vendorController.deleteVendor);   // Delete vendor (Protected)

// Vendor booking routes (requires user authentication)
router.post('/book', authMiddleware, vendorController.bookVendor);                  // Book a vendor (Protected)
router.put('/bookings/:id', authMiddleware, vendorController.updateVendorBooking);  // Update vendor booking by ID (Protected)
router.delete('/bookings/:id', authMiddleware, vendorController.deleteVendorBooking); // Delete vendor booking by ID (Protected)

module.exports = router;
