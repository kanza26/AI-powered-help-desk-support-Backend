const jwtService = require('../services/jwtService');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token missing' });
    }

    let decoded;
    try {
        decoded = jwtService.verifyAccessToken(token);
    } catch (err) {
        // ✅ Only TokenExpiredError is re-thrown from verifyAccessToken
        return res.status(401).json({ success: false, message: err.message });
    }

    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = decoded;
    next();
};

module.exports = authMiddleware;