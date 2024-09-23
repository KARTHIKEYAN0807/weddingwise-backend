const jwt = require('jsonwebtoken');

// Refresh token
exports.refreshToken = (req, res) => {
    const { token } = req.body;

    // Check if token exists in the request
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the old token ignoring the expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        
        // Check if the token has actually expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decoded.exp > currentTime) {
            return res.status(400).json({
                success: false,
                message: 'Token is still valid. No need to refresh.'
            });
        }

        const user = decoded.user;

        // Generate a new token with a 1-hour expiration time
        const newToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success: true, token: newToken });

    } catch (err) {
        console.error(`[POST] /refresh-token - Token refresh failed: ${err.message}`);

        // Determine error message based on the JWT error
        let errorMessage = 'Token refresh failed';
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired and cannot be refreshed';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token provided';
        }

        return res.status(401).json({ success: false, message: errorMessage });
    }
};
