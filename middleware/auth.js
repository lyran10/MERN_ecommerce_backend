// middleware/auth.js
const { verifyToken } = require('../utils/jwt');
const User = require('../models/user');

module.exports = async function authMiddleware(req, res, next){
  try {
    let token = null;
   
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({message:'No token'});

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({message:'User not found'});
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return res.status(401).json({message:'Invalid token'});
  }
}
