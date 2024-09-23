const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Retrieve the Authorization header
    const authHeader = req.header('Authorization');

    // Check if the Authorization header exists and is properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn(`[${req.method}] ${req.url} - Missing or malformed Authorization header`);
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user } = decoded;

        // Check if the user object exists and has admin privileges
        if (!user || !user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
        }

        // Attach the user information to the request object for further use
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(`[${req.method}] ${req.url} - Token verification failed: ${err.message}`);

        // Handle token-specific errors and set appropriate error messages
        let message = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            message = 'Token has expired, please log in again';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Invalid token, authorization denied';
        }

        // Return a 401 Unauthorized status with the error message
        return res.status(401).json({ success: false, message });
    }
};
