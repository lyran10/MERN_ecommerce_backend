// routes/auth.js
const express = require('express');
const router = express.Router();
const { firebaseLogin, logout } = require('../controllers/authController');
const verifyFirebase = require('../middleware/verifyFirebase');

router.post('/firebase-login', firebaseLogin); // expects { idToken }
router.post('/logout', logout);

module.exports = router;
