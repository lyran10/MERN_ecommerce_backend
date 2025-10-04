const User = require('../models/user');
const admin = require('../config/firebaseAdmin'); // Firebase Admin SDK
const { signToken } = require('../utils/jwt');

exports.firebaseLogin = async (req, res) => {
  try {
    const { idToken, email, password } = req.body;

    // 1️⃣ Google/Firebase login (already working)
    if (idToken) {
      const decoded = await admin.auth().verifyIdToken(idToken);
      const { uid, name, email: googleEmail, picture } = decoded;

      let user = await User.findOne({ firebaseUid: uid });
      let message = '';

      if (!user) {
        user = await User.create({
          firebaseUid: uid,
          name: name || '',
          email: googleEmail || '',
          avatar: picture || ''
        });
        message = 'Account created via Google 🎉';
      } else {
        user.name = name || user.name;
        user.email = googleEmail || user.email;
        user.avatar = picture || user.avatar;
        await user.save();
        message = 'Login successful via Google 🎉';
      }

      const token = signToken({ id: user._id, role: user.role });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 1000*60*60*24*7 });
      return res.json({ message, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    }

    // 2️⃣ Email/Password login via Firebase
    if (email && password) {
      try {
        // Try fetching Firebase user
        let firebaseUser;
        try {
          firebaseUser = await admin.auth().getUserByEmail(email);
        } catch (err) {
          // user not found in Firebase, create
          firebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: email.split('@')[0]
          });
        }

        // At this point, Firebase user exists
        let user = await User.findOne({ firebaseUid: firebaseUser.uid });
        let message = '';

        if (!user) {
          // Create in MongoDB
          user = await User.create({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName
          });
          message = 'Account created 🎉';
        } else {
          message = 'Login successful 🎉';
        }

        const token = signToken({ id: user._id, role: user.role });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 1000*60*60*24*7 });
        return res.json({ message, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });

      } catch (err) {
        console.error('Firebase email/password login error', err);
        return res.status(401).json({ message: 'Invalid email or password ❌' });
      }
    }

    return res.status(400).json({ message: 'Provide idToken or email & password ⚠️' });

  } catch (err) {
    console.error('authLogin error', err);
    return res.status(500).json({ message: 'Login error ❌' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ message: 'Logged out successfully 👋' });
};

