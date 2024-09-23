const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn(`Authorization header missing or improperly formatted for ${req.method} ${req.url}`);
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user } = decoded;

        // Check if the user has admin rights
        if (!user || !user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(`Token verification failed for ${req.method} ${req.url}:`, err.message);

        let message = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            message = 'Token has expired, please log in again';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Invalid token, authorization denied';
        }

        return res.status(401).json({ success: false, message });
    }
};
