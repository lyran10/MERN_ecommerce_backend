// config/firebaseAdmin.js
const admin = require('firebase-admin');

function initFirebaseAdmin(){
  if (admin.apps.length) return admin;

  let serviceAccount;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  } else {
    // expects file ./serviceAccountKey.json (downloaded from Firebase console)
    serviceAccount = require('../serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase admin initialized');
  return admin;
}

module.exports = initFirebaseAdmin();
