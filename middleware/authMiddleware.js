const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.trim().startsWith('Bearer ')) {
        console.warn('Authorization header missing or improperly formatted');
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1].trim();

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);

        let message = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            message = 'Token has expired, please login again';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Invalid token, authorization denied';
        }

        return res.status(401).json({ success: false, message });
    }
};
