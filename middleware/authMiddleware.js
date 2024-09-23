const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.trim().startsWith('Bearer ')) {
        console.warn('Authorization header missing or improperly formatted');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1].trim();

    if (!token) {
        return res.status(401).json({ msg: 'Token is missing, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired, please login again' });
        }
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
