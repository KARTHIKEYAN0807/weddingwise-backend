const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Ensure user is authenticated
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token is missing, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user has admin rights
        if (!decoded.user || !decoded.user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied: Admins only' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired, please log in again' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token, authorization denied' });
        }

        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
