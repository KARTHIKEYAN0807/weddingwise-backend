const jwt = require('jsonwebtoken');

// Refresh token controller
exports.refreshToken = (req, res) => {
    const { token } = req.body;

    // Check if token exists in the request
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token, allowing it to bypass the expiration check
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

        // Ensure the token has actually expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decoded.exp > currentTime) {
            return res.status(400).json({
                success: false,
                message: 'Token is still valid, no need to refresh.'
            });
        }

        const user = decoded.user;

        // Generate a new token with a 1-hour expiration time
        const newToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success: true, token: newToken });

    } catch (err) {
        console.error(`[POST] /refresh-token - Token refresh failed: ${err.message}`);

        // Handle various JWT errors
        let errorMessage = 'Token refresh failed';
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired and cannot be refreshed.';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token provided.';
        }

        return res.status(401).json({ success: false, message: errorMessage });
    }
};
