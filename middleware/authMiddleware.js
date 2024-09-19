const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from the Authorization header
    const authHeader = req.header('Authorization');

    // Check if the token is missing or if the format is incorrect
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Authorization header missing or invalid'); // Debugging log
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract the token by removing 'Bearer ' prefix
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user data to the request object
        req.user = decoded.user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);

        // Provide a more specific error message if the token is expired
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired, please login again' });
        }

        // Return a generic invalid token message for other errors
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
