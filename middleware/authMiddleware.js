const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Retrieve the Authorization header
    const authHeader = req.header('Authorization');

    // Check if the Authorization header exists and follows the correct format
    if (!authHeader || !authHeader.trim().startsWith('Bearer ')) {
        console.warn('Authorization header missing or improperly formatted');
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1].trim();

    // If the token is missing, respond with a 401 Unauthorized status
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing, authorization denied' });
    }

    // Try to verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret
        req.user = decoded.user; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware
    } catch (err) {
        console.error('Token verification failed:', err.message);

        // Handle different JWT errors
        let message = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            message = 'Token has expired, please login again';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Invalid token, authorization denied';
        }

        // Respond with a 401 Unauthorized status and the appropriate error message
        return res.status(401).json({ success: false, message });
    }
};
