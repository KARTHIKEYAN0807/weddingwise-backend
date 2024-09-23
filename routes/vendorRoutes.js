const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', vendorController.getAllVendors);         // Get all vendors
router.get('/:id', vendorController.getVendorById);      // Get vendor by ID

// Protected routes for vendor booking
router.post('/book', authMiddleware, vendorController.bookVendor); // Book a vendor
router.put('/bookings/:id', authMiddleware, vendorController.updateVendorBooking); // Update vendor booking
router.delete('/bookings/:id', authMiddleware, vendorController.deleteVendorBooking); // Delete vendor booking

// Admin-protected routes for vendor management
router.post('/', [authMiddleware, adminMiddleware], vendorController.createVendor);   // Admin: Create vendor
router.put('/:id', [authMiddleware, adminMiddleware], vendorController.updateVendor); // Admin: Update vendor
router.delete('/:id', [authMiddleware, adminMiddleware], vendorController.deleteVendor); // Admin: Delete vendor

// Handle invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
