const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        // Retrieve the Authorization header from the request
        const authHeader = req.header('Authorization')?.trim();

        // Validate the existence and format of the Authorization header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn(`[${req.method}] ${req.url} - Missing or improperly formatted Authorization header`);
            return res.status(401).json({ success: false, message: 'Authorization token missing or invalid' });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure the decoded token contains user information
        if (!decoded || !decoded.user) {
            console.error(`[${req.method}] ${req.url} - Decoded token does not contain user information`);
            return res.status(403).json({ success: false, message: 'Invalid token: user data not found' });
        }

        // Attach the decoded user information to the request object for further processing
        req.user = decoded.user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Log the error for debugging purposes
        console.error(`[${req.method}] ${req.url} - JWT verification failed: ${err.message}`);

        // Handle specific JWT errors and return appropriate responses
        let errorMessage = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired, please log in again';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token, authorization denied';
        }

        // Respond with a 401 Unauthorized status and a specific error message
        return res.status(401).json({ success: false, message: errorMessage });
    }
};
