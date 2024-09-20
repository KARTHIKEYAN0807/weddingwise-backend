require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

// Sample event data to seed into the database
const events = [
  {
    title: 'Wedding Ceremony',
    description: 'The main event. Join us for a beautiful ceremony.',
    date: '2024-01-01',
    location: 'Central Park, NYC',
    price: 500,
    img: '/images/wedding_ceremony.jpg'
  },
  {
    title: 'Reception',
    description: 'Celebrate with friends and family at our reception.',
    date: '2024-01-02',
    location: 'Grand Ballroom, NYC',
    price: 300,
    img: '/images/reception.jpg'
  },
  {
    title: 'Engagement Party',
    description: 'Celebrate your engagement with loved ones.',
    date: '2024-01-03',
    location: 'The Sunset Terrace, NYC',
    price: 200,
    img: '/images/engagement_party.jpg'
  },
  {
    title: 'Bridal Shower',
    description: 'A special party for the bride-to-be.',
    date: '2024-01-04',
    location: 'Tea Room, NYC',
    price: 150,
    img: '/images/bridal_shower.jpg'
  },
  {
    title: 'Rehearsal Dinner',
    description: 'Pre-wedding gathering.',
    date: '2024-01-05',
    location: 'Rooftop Restaurant, NYC',
    price: 350,
    img: '/images/rehearsal_dinner.jpg'
  }
];

// Seed the events into the database
async function seedEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear the existing events
    const deleted = await Event.deleteMany();
    console.log(`Deleted ${deleted.deletedCount} existing events`);

    // Insert new events
    const inserted = await Event.insertMany(events);
    console.log(`${inserted.length} events seeded successfully`);

  } catch (err) {
    console.error('Error seeding events:', err);
  } finally {
    // Ensure mongoose connection is closed
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedEvents();
