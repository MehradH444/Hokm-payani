const jwt = require('jsonwebtoken');
const User = require('./User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hokm_master_super_secret_jwt_key_2026_production');

      req.user = await User.findById(decoded.id).select('-__v');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'کاربر یافت نشد.' });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({ success: false, message: 'توکن نامعتبر یا منقضی شده است.' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'دسترسی غیرمجاز! توکن ارسال نشده است.' });
  }
};

module.exports = { protect };
