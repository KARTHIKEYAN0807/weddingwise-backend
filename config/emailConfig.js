const nodemailer = require('nodemailer');

// Logging environment variables for debugging
console.log('Email User:', process.env.EMAIL_USER); 
console.log('Email Pass:', process.env.EMAIL_PASS ? '*****' : 'Not set'); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send the reset password email
const sendResetPasswordEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Please click on the following link to reset your password: ${resetLink}`,
        html: `<p>Please click on the following link to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset password email sent successfully');
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email');
    }
};

module.exports = { sendResetPasswordEmail };
