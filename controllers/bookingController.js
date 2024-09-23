const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Event = require('../models/Event'); // Import Event model
const Vendor = require('../models/Vendor'); // Import Vendor model

// Confirm booking
async function confirmBooking(req, res) {
    try {
        const { bookedEvents, bookedVendors } = req.body;
        
        // Ensure the user is authenticated
        if (!req.user || !req.user.email) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const userEmail = req.user.email;

        // Validate that there are events or vendors to book
        if ((!bookedEvents || bookedEvents.length === 0) && (!bookedVendors || bookedVendors.length === 0)) {
            return res.status(400).json({ msg: 'No events or vendors provided for booking.' });
        }

        // Validate event and vendor data
        if (bookedEvents) {
            bookedEvents.forEach(event => {
                if (!event.event || !mongoose.Types.ObjectId.isValid(event.event)) {
                    throw new Error('Invalid event ID');
                }
            });
        }

        if (bookedVendors) {
            bookedVendors.forEach(vendor => {
                if (!vendor.vendor || !mongoose.Types.ObjectId.isValid(vendor.vendor)) {
                    throw new Error('Invalid vendor ID');
                }
            });
        }

        // Save the events and vendors to the database if not already saved
        const savedEvents = await saveBookings(bookedEvents || [], 'Event');
        const savedVendors = await saveBookings(bookedVendors || [], 'Vendor');

        // Generate email content
        const htmlContent = generateEmailContent(savedEvents, savedVendors);

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Booking Confirmation - WeddingWise',
            html: htmlContent,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ 
                status: 'success', 
                message: 'Booking confirmed and email sent.', 
                bookings: { savedEvents, savedVendors } 
            });
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            res.status(500).json({ 
                status: 'warning', 
                message: 'Booking confirmed, but error sending confirmation email.', 
                bookings: { savedEvents, savedVendors } 
            });
        }
    } catch (err) {
        console.error('Error confirming booking:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

// Helper function to save bookings to the database if not already saved
async function saveBookings(bookings, bookingType) {
    const savedBookings = [];

    for (const booking of bookings) {
        try {
            // If the booking doesn't have an _id or if it starts with 'local-', treat it as a new booking
            if (!booking._id || booking._id.startsWith('local-')) {
                if (bookingType === 'Event') {
                    if (!booking.eventName) {
                        booking.eventName = 'Untitled Event';
                    }
                    if (!booking.event) {
                        const eventDetails = await Event.findById(booking.event);
                        if (!eventDetails) {
                            throw new Error(`Event not found with ID: ${booking.event}`);
                        }
                        booking.eventName = eventDetails.name;
                        booking.img = eventDetails.img;
                    }
                } else if (bookingType === 'Vendor') {
                    if (!booking.vendorName) {
                        booking.vendorName = 'Untitled Vendor';
                    }
                    if (!booking.vendor) {
                        const vendorDetails = await Vendor.findById(booking.vendor);
                        if (!vendorDetails) {
                            throw new Error(`Vendor not found with ID: ${booking.vendor}`);
                        }
                        booking.vendorName = vendorDetails.name;
                    }
                }

                // Remove temporary _id if it exists and save the booking
                if (booking._id && booking._id.startsWith('local-')) {
                    delete booking._id;
                }

                const savedBooking = new Booking({ ...booking, bookingType });
                await savedBooking.save();
                savedBookings.push(savedBooking);
            } else {
                // Fetch existing bookings if they already exist
                const existingBooking = await Booking.findById(booking._id);
                if (!existingBooking) {
                    throw new Error(`Booking not found with ID: ${booking._id}`);
                }
                savedBookings.push(existingBooking);
            }
        } catch (err) {
            console.error('Error saving booking:', err);
            throw err; // Throw error to prevent further processing
        }
    }
    return savedBookings;
}

// Helper function to generate email HTML content
function generateEmailContent(bookedEvents, bookedVendors) {
    const eventItemsHtml = bookedEvents.map(event => `
        <div style="margin-bottom: 10px;">
            <h3>${encodeHTML(event.eventName)}</h3>
            <p>Guests: ${event.guests || 'Not specified'}</p>
            ${event.img ? `<img src="${event.img}" alt="${encodeHTML(event.eventName)}" style="max-width: 100%;">` : ''}
        </div>
    `).join('');

    const vendorItemsHtml = bookedVendors.map(vendor => `
        <div style="margin-bottom: 10px;">
            <h3>${encodeHTML(vendor.vendorName)}</h3>
            <p>Date: ${vendor.date ? new Date(vendor.date).toLocaleDateString() : 'No date provided.'}</p>
        </div>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <div style="padding: 20px 0;">
                <h2 style="color: #333;">Booking Confirmation</h2>
                <p>Dear Customer,</p>
                <p>Thank you for choosing WeddingWise. Your bookings have been successfully confirmed. Here are the details:</p>
                <h3>Events</h3>
                ${eventItemsHtml || '<p>No events booked.</p>'}
                <h3>Vendors</h3>
                ${vendorItemsHtml || '<p>No vendors booked.</p>'}
            </div>
            <div style="padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                <p style="color: #666;">If you have any questions, feel free to contact us at:</p>
                <p style="color: #666;">Phone: +1 (123) 456-7890 | Email: support@weddingwise.com</p>
                <p style="color: #666;">Follow us on:</p>
                <p>
                    <a href="https://www.facebook.com/weddingwise" style="text-decoration: none;">Facebook</a> | 
                    <a href="https://www.instagram.com/weddingwise" style="text-decoration: none;">Instagram</a> | 
                    <a href="https://www.twitter.com/weddingwise" style="text-decoration: none;">Twitter</a>
                </p>
            </div>
        </div>
    `;
}

// Function to encode HTML to prevent HTML injection
function encodeHTML(str) {
    return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') : '';
}

module.exports = { confirmBooking };
