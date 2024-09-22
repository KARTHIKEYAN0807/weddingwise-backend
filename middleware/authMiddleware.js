const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');

    // Check if the Authorization header is present and properly formatted
    if (!authHeader || !authHeader.trim().startsWith('Bearer ')) {
        console.warn('Authorization header missing or improperly formatted'); // Debugging log
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract the token by removing the 'Bearer ' prefix
    const token = authHeader.split(' ')[1].trim();

    if (!token) {
        return res.status(401).json({ msg: 'Token is missing, authorization denied' });
    }

    try {
        // Verify token using the JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded user data to the request object for future middleware/routes
        req.user = decoded.user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);

        // Handle specific token expiration error
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired, please login again' });
        }

        // Return generic invalid token message for other errors
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
