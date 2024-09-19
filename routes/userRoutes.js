const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
    registerUser,
    loginUser,
    sendResetPasswordEmail,
    resetPassword,
    updateUserProfile,
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Helper function to format validation errors
const formatValidationErrors = (errors) => {
    return errors.array().map(error => ({
        field: error.param,
        message: error.msg
    }));
};

// Register user with validation
router.post('/register', [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters long and contain at least one number and one special character')
        .isLength({ min: 6 })
        .matches(/\d/)
        .matches(/[!@#$%^&*(),.?":{}|<>]/) // Optional: check for special characters
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: formatValidationErrors(errors) });
    }
    next();
}, registerUser);

// Login user with validation
router.post('/login', [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: formatValidationErrors(errors) });
    }
    next();
}, loginUser);

// Send reset password email
router.post('/send-reset-password-email', [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: formatValidationErrors(errors) });
    }
    next();
}, sendResetPasswordEmail);

// Reset password with validation
router.post('/reset-password', [
    check('token', 'Token is required').exists(),
    check('newPassword', 'Password must be at least 6 characters long').isLength({ min: 6 }),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: formatValidationErrors(errors) });
    }
    next();
}, resetPassword);

// Update user profile with authentication
router.put('/update-profile', auth, [
    check('name', 'Name is required').optional().not().isEmpty().trim(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: formatValidationErrors(errors) });
    }
    next();
}, updateUserProfile);

module.exports = router;
