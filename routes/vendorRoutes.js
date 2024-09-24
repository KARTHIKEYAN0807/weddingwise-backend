const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', vendorController.getAllVendors);         // Get all vendors
router.get('/:id', vendorController.getVendorById);      // Get vendor by ID

// Protected routes for vendor booking and vendor management (require authentication)
router.post('/book', authMiddleware, vendorController.bookVendor); // Book a vendor
router.put('/bookings/:id', authMiddleware, vendorController.updateVendorBooking); // Update vendor booking
router.delete('/bookings/:id', authMiddleware, vendorController.deleteVendorBooking); // Delete vendor booking

// Vendor management (accessible by all authenticated users)
router.post('/', authMiddleware, vendorController.createVendor);   // Authenticated users can create a new vendor
router.put('/:id', authMiddleware, vendorController.updateVendor); // Authenticated users can update an existing vendor
router.delete('/:id', authMiddleware, vendorController.deleteVendor); // Authenticated users can delete a vendor

// Handle invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
