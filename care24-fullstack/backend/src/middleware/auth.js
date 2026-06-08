const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch {
      return res.status(401).json({ success: false, message: 'Not authorised, token failed' });
    }
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorised, no token' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Admin access only' });
};

const caregiverOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'caregiver' || req.user.role === 'admin')) return next();
  res.status(403).json({ success: false, message: 'Caregiver access only' });
};

module.exports = { protect, adminOnly, caregiverOnly };
