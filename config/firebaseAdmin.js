// config/firebaseAdmin.js
const admin = require('firebase-admin');

function initFirebaseAdmin(){
  if (admin.apps.length) return admin;

  let serviceAccount;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  } else {
    // expects file ./serviceAccountKey.json (downloaded from Firebase console)
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase admin initialized');
  return admin;
}

module.exports = initFirebaseAdmin();
