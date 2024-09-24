const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', vendorController.getAllVendors);         // Get all vendors (public)
router.get('/:id', vendorController.getVendorById);      // Get vendor by ID (public)

// Protected routes for vendor bookings (require authentication)
router.post('/book', authMiddleware, vendorController.addVendorToCart); // Add vendor to cart (unconfirmed booking)
router.put('/bookings/:id', authMiddleware, vendorController.updateVendorBooking); // Update vendor booking
router.delete('/bookings/:id', authMiddleware, vendorController.deleteVendorBooking); // Delete vendor booking
router.post('/confirm-booking/:id', authMiddleware, vendorController.confirmVendorBooking); // Confirm booking (from cart)

// Vendor management routes (require authentication for creating, updating, or deleting vendors)
router.post('/', authMiddleware, vendorController.createVendor);   // Create a new vendor
router.put('/:id', authMiddleware, vendorController.updateVendor); // Update an existing vendor
router.delete('/:id', authMiddleware, vendorController.deleteVendor); // Delete a vendor

// Handle invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
