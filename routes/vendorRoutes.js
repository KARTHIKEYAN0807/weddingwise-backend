const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

// Vendor management routes
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);

// Vendor booking routes
router.post('/book', authMiddleware, vendorController.bookVendor);
router.put('/bookings/:id', authMiddleware, vendorController.updateVendorBooking);
router.delete('/bookings/:id', authMiddleware, vendorController.deleteVendorBooking);

// Vendor creation, update, delete (Admin)
router.post('/', authMiddleware, vendorController.createVendor);
router.put('/:id', authMiddleware, vendorController.updateVendor);
router.delete('/:id', authMiddleware, vendorController.deleteVendor);

// Handle invalid routes
router.all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = router;
