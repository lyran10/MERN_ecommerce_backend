// middleware/verifyFirebase.js
const admin = require('../config/firebaseAdmin');

module.exports = async function verifyFirebaseToken(req, res, next){
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.body && req.body.idToken) {
      token = req.body.idToken;
    } else if (req.query && req.query.idToken) {
      token = req.query.idToken;
    }
    if (!token) return res.status(401).json({message:'No Firebase ID token provided'});

    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded; // contains uid, email, name...
    next();
  } catch (err) {
    console.error('Firebase verify error', err);
    return res.status(401).json({message:'Invalid Firebase ID token'});
  }
}
