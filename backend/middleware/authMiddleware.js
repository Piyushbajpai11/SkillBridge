const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            return next(); // ✅ Only move to next if successful
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' }); // ✅ return here
        }
    }

    // If no token at all
    return res.status(401).json({ message: 'Not authorized, no token' }); // ✅ make sure it's not below try block
};

// Role-based middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
