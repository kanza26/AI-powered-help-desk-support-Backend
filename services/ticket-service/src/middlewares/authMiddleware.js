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
    const decoded = jwtService.verifyAccessToken(token);
    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    console.log('Decoded token:', decoded);  // Debugging log
    
    req.user = decoded;
    next();
};

module.exports = authMiddleware;