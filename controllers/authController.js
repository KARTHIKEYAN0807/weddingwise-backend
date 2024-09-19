const jwt = require('jsonwebtoken');

// Refresh token
exports.refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Verify the old token without considering expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const user = decoded.user;

        // Generate a new token
        const newToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: newToken });
    } catch (err) {
        console.error('Error refreshing token:', err.message);
        res.status(401).json({ msg: 'Token refresh failed' });
    }
};
