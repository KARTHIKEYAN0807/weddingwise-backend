const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Vendor name is required'], // Vendor's name is required
        trim: true,                                  // Automatically trim spaces
        unique: true,                                // Ensure vendor names are unique
    },
    description: { 
        type: String, 
        trim: true,                                  // Automatically trim spaces
        maxlength: 500,                              // Limit description to 500 characters
    },
    img: { 
        type: String, 
        default: '/images/default-vendor.jpg',       // Provide a default image if none is supplied
        validate: {
            validator: function(value) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(value); // Basic URL validation for image
            },
            message: 'Please provide a valid image URL (jpg, jpeg, png, gif, webp).'
        }
    },
}, { timestamps: true });                            // Automatically manage `createdAt` and `updatedAt` timestamps

module.exports = mongoose.model('Vendor', VendorSchema);
