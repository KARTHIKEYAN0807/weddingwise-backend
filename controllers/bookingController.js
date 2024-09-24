const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');
const Event = require('../models/Event');
const Vendor = require('../models/Vendor');

// Constants for HTTP status codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
};

// Email settings
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_SUBJECT = 'Booking Confirmation - WeddingWise';

// Confirm booking
async function confirmBooking(req, res) {
    try {
        const { bookedEvents, bookedVendors } = req.body;

        // Ensure the user is authenticated
        if (!req.user || !req.user.email) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'User not authenticated' });
        }

        const userEmail = req.user.email;

        // Validate that there are events or vendors to book
        if ((!bookedEvents || bookedEvents.length === 0) && (!bookedVendors || bookedVendors.length === 0)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'No events or vendors provided for booking.' });
        }

        // Save the events and vendors to the database
        const savedEvents = await saveBookings(bookedEvents || [], 'Event');
        const savedVendors = await saveBookings(bookedVendors || [], 'Vendor');

        // Generate email content
        const htmlContent = generateEmailContent(savedEvents, savedVendors);

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: EMAIL_USER,
            to: userEmail,
            subject: EMAIL_SUBJECT,
            html: htmlContent,
        };

        // Try sending the email and respond with success
        await transporter.sendMail(mailOptions).catch(err => {
            console.error('Error sending email:', err);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Error sending confirmation email' });
        });

        // Respond with success and the saved bookings
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Booking confirmed and email sent.',
            bookings: { savedEvents, savedVendors },
        });

    } catch (err) {
        console.error('Error confirming booking:', err); // Log the error
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Server error', error: err.message });
    }
}

// Fetch bookings for the authenticated user
async function getUserBookings(req, res) {
    try {
        if (!req.user || !req.user.email) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'User not authenticated' });
        }

        const userEmail = req.user.email;
        const userBookings = await Booking.find({ email: userEmail });

        if (!userBookings || userBookings.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'No bookings found for the user' });
        }

        return res.status(HTTP_STATUS.OK).json({ success: true, bookings: userBookings });
    } catch (err) {
        console.error('Error fetching user bookings:', err); // Log the error
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Server error', error: err.message });
    }
}

// Fetch booking by ID
async function getBookingById(req, res) {
    try {
        const bookingId = req.params.id;

        // Find the booking by its ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Booking not found' });
        }

        return res.status(HTTP_STATUS.OK).json({ success: true, booking });
    } catch (err) {
        console.error('Error fetching booking by ID:', err);
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Server error', error: err.message });
    }
}

// Helper function to save bookings to the database
async function saveBookings(bookings, bookingType) {
    const savedBookings = [];

    for (const booking of bookings) {
        try {
            let savedBooking;

            if (!booking._id || booking._id.startsWith('local-')) {
                // Handle new bookings
                savedBooking = await handleNewBooking(booking, bookingType);
            } else {
                // Fetch existing bookings
                savedBooking = await Booking.findById(booking._id);
                if (!savedBooking) throw new Error(`Booking not found with ID: ${booking._id}`);
            }

            savedBookings.push(savedBooking);
        } catch (err) {
            console.error('Error saving booking:', err); // Log the error
            throw err;
        }
    }

    return savedBookings;
}

// Helper function to handle new bookings
async function handleNewBooking(booking, bookingType) {
    if (bookingType === 'Event') {
        if (!booking.eventName) booking.eventName = 'Untitled Event';
        if (!booking.event) {
            const eventDetails = await Event.findById(booking.event);
            if (!eventDetails) throw new Error(`Event not found with ID: ${booking.event}`);
            booking.eventName = eventDetails.name;
            booking.img = eventDetails.img;
        }
    } else if (bookingType === 'Vendor') {
        if (!booking.vendorName) booking.vendorName = 'Untitled Vendor';
        if (!booking.vendor) {
            const vendorDetails = await Vendor.findById(booking.vendor);
            if (!vendorDetails) throw new Error(`Vendor not found with ID: ${booking.vendor}`);
            booking.vendorName = vendorDetails.name;
        }
    }

    if (booking._id && booking._id.startsWith('local-')) delete booking._id;

    const newBooking = new Booking({ ...booking, bookingType });
    await newBooking.save();
    return newBooking;
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

module.exports = { confirmBooking, getUserBookings, getBookingById };
