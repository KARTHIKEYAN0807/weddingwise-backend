require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

// Sample vendor data to seed into the database
const vendors = [
  {
    name: 'ABC Catering',
    description: 'Expert in exotic dishes for your special day.',
    email: 'contact@abccatering.com',
    img: '/images/catering.jpg',
  },
  {
    name: 'XYZ Photography',
    description: 'Capturing moments beautifully to last a lifetime.',
    email: 'contact@xyzphotography.com',
    img: '/images/photography.jpg',
  },
  {
    name: 'Elegant Florists',
    description: 'Beautiful floral arrangements for your big day.',
    email: 'contact@elegantflorists.com',
    img: '/images/florist.jpg',
  },
  {
    name: 'Classic Musicians',
    description: 'Live music to set the mood for your wedding.',
    email: 'contact@classicmusicians.com',
    img: '/images/musicians.jpg',
  },
  {
    name: 'Luxurious Transportation',
    description: 'Arrive in style with our premium wedding transportation.',
    email: 'contact@luxtransport.com',
    img: '/images/transportation.jpg',
  }
];

// Seed the vendors into the database
async function seedVendors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear the existing vendors
    await Vendor.deleteMany();
    console.log('Existing vendors cleared');

    // Insert new vendors
    await Vendor.insertMany(vendors);
    console.log('Vendors seeded successfully');
    
    // Close the connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding vendors:', err);
    mongoose.connection.close();
  }
}

seedVendors();
