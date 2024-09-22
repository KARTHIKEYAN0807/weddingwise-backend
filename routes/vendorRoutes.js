// backend/routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

// Vendor management routes
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.post('/', vendorController.createVendor);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

// Vendor booking routes
router.post('/book', vendorController.bookVendor);
router.put('/bookings/:id', vendorController.updateVendorBooking);
router.delete('/bookings/:id', vendorController.deleteVendorBooking);

module.exports = router;
