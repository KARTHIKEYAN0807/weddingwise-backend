require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

// Sample event data to seed into the database
const events = [
  {
    title: 'Wedding Ceremony',
    description: 'The main event. Join us for a beautiful ceremony.',
    email: 'contact@weddingceremony.com',
    img: '/images/wedding_ceremony.jpg',
  },
  {
    title: 'Reception',
    description: 'Celebrate with friends and family at our reception.',
    email: 'contact@reception.com',
    img: '/images/reception.jpg',
  },
  {
    title: 'Engagement Party',
    description: 'Celebrate your engagement with loved ones.',
    email: 'contact@engagementparty.com',
    img: '/images/engagement_party.jpg',
  },
  {
    title: 'Bridal Shower',
    description: 'A special party for the bride-to-be.',
    email: 'contact@bridalshower.com',
    img: '/images/bridal_shower.jpg',
  },
  {
    title: 'Rehearsal Dinner',
    description: 'Pre-wedding gathering with family and friends.',
    email: 'contact@rehearsaldinner.com',
    img: '/images/rehearsal_dinner.jpg',
  }
];

// Seed the events into the database
async function seedEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear the existing events
    await Event.deleteMany();
    console.log('Existing events cleared');

    // Insert new events
    await Event.insertMany(events);
    console.log('Events seeded successfully');
    
    // Close the connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding events:', err);
    mongoose.connection.close();
  }
}

seedEvents();
