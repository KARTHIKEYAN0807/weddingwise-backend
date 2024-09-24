// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Configure Nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email password
            }
        });

        // Setup email data
        let mailOptions = {
            from: email, // Sender address
            to: process.env.RECEIVING_EMAIL, // Your email address
            subject: `Contact Form Submission from ${name}`,
            text: `You have received a new message from ${name} (${email}):\n\n${message}`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Failed to send message.' });
    }
});

module.exports = router;