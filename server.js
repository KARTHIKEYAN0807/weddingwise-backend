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
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const { body, validationResult } = require('express-validator'); // Import for validation

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

// Rate limiting middleware (global)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://weddingwisebooking.netlify.app',
            'https://master--weddingwisebooking.netlify.app',
            'http://localhost:5173',
        ];

        if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl)
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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

// Rate limiting specifically for the contact form to avoid spam
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact form requests per hour
    message: 'Too many contact form submissions from this IP, please try again after an hour',
});

// Contact form route to handle sending emails
app.post(
    '/api/contact',
    contactLimiter, // Apply rate limiting to the contact form
    [
        body('email').isEmail().withMessage('Please enter a valid email address'), // Email validation
        body('message').notEmpty().withMessage('Message field cannot be empty'), // Message validation
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, message } = req.body;

        // Configure Nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
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
    }
);

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
