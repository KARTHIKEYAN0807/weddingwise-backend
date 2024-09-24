const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendResetPasswordEmail } = require('../config/emailConfig');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'All fields are required: name, email, and password.' });
        }

        // Password strength validation
        if (password.length < 6 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters long and include a number and special character.' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email.' });
        }

        // Create new user
        user = new User({ name, email, password });
        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id, name: user.name, email: user.email } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ 
            token,
            userData: payload.user 
        });
    } catch (err) {
        console.error('Error registering user:', err);

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }

        res.status(500).json({ msg: 'Server error occurred during registration.' });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required.' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials. User not found.' });
        }

        // Use schema's method to compare password
        const isMatch = await user.comparePassword(password);
        console.log('Password match result:', isMatch);
        if (!isMatch) {
            console.log('Password mismatch:', { password, hashed: user.password });
            return res.status(400).json({ msg: 'Invalid credentials. Incorrect password.' });
        }

        // Generate JWT token
        const payload = { user: { id: user.id, name: user.name, email: user.email } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            userData: payload.user
        });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ msg: 'Server error occurred during login.' });
    }
};

// Send reset password email
exports.sendResetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate required field
        if (!email) {
            return res.status(400).json({ msg: 'Email is required to send a reset password link.' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found with this email.' });
        }

        // Generate reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send reset email
        await sendResetPasswordEmail(email, resetLink);
        res.json({ msg: 'Password reset email sent.' });
    } catch (err) {
        console.error('Error in sendResetPasswordEmail function:', err.message);
        res.status(500).json({ msg: 'Error sending email, please try again later.' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Validate required fields
        if (!token || !newPassword) {
            return res.status(400).json({ msg: 'Token and new password are required.' });
        }

        // Password strength validation
        if (newPassword.length < 6 || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters long and include a number and special character.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid token. User not found.' });
        }

        // Update the password directly (will be hashed by the schema's pre-save hook)
        user.password = newPassword;
        await user.save();

        // Log for debugging
        console.log('Password has been successfully reset for user:', user.email);
        console.log('New hashed password:', user.password);

        res.json({ msg: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Error resetting password:', err.message);

        // Handle JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ msg: 'Reset token has expired.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({ msg: 'Invalid token.' });
        }

        res.status(500).json({ msg: 'Server error occurred while resetting password.' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        // Get the user by ID
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        // Update user's name
        const { name } = req.body;
        user.name = name || user.name;
        await user.save();

        // Create a new token with updated user data
        const payload = { user: { id: user.id, name: user.name, email: user.email } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            userData: payload.user,
        });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ msg: 'Server error occurred while updating profile.' });
    }
};