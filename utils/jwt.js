// utils/jwt.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'change_me';

function signToken(payload){
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function verifyToken(token){
  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };
