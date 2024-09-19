require('dotenv').config(); // Ensure this is at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit'); 
const morgan = require('morgan'); 
const nodemailer = require('nodemailer'); // Import Nodemailer
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes'); // Import the authRoutes

const app = express();

// Ensure required environment variables are set
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}. Please check your .env file.`);
    process.exit(1);
}

// Log environment variables for debugging in development mode
if (process.env.NODE_ENV === 'development') {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '*****' : 'Not set');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '*****' : 'Not set');
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
}

// Security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'https://weddingwisebooking.netlify.app/login',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('combined'));

// MongoDB connection
(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
})();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Contact form route to handle sending emails
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Configure Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail', // or any email provider
        auth: {
            user: process.env.EMAIL_USER, // your email
            pass: process.env.EMAIL_PASS, // your email password
        },
    });

    let mailOptions = {
        from: email, // sender address (user's email)
        to: process.env.EMAIL_USER, // receiving address (your email)
        subject: `Contact Form Submission from ${name}`,
        text: `You have received a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ msg: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending contact form email:', error);
        res.status(500).send({ msg: 'Failed to send message.' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('WeddingWise Backend API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
    console.log('Shutting down server...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
