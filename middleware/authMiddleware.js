const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get the Authorization header
    const authHeader = req.header('Authorization');

    // Check if the header exists and is in the correct format
    if (!authHeader || !authHeader.trim().startsWith('Bearer ')) {
        console.warn('Authorization header missing or improperly formatted');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1].trim();

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ msg: 'Token is missing, authorization denied' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded.user;
        
        // Move to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);

        // Handle specific error scenarios for better client-side feedback
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired, please login again' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token, authorization denied' });
        } else {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
    }
};
