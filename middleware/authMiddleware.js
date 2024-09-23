const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        // Retrieve and trim the Authorization header from the request
        const authHeader = req.header('Authorization')?.trim();

        // Check if the Authorization header exists and follows the 'Bearer <token>' format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn(`[${req.method}] ${req.url} - Missing or malformed Authorization header`);
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }

        // Extract the token from the Authorization header (after 'Bearer ')
        const token = authHeader.split(' ')[1];

        // Verify the token using the secret key stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object for further use
        req.user = decoded.user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Log detailed token verification failure info for debugging
        console.error(`[${req.method}] ${req.url} - Token verification failed: ${err.message}`);

        // Handle specific JWT error types and provide detailed feedback
        let errorMessage = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired, please log in again';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token, authorization denied';
        }

        // Respond with a 401 Unauthorized status and the specific error message
        return res.status(401).json({ success: false, message: errorMessage });
    }
};
