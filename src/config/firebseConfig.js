const admin = require('firebase-admin');
const firebaseConfig = require('../config/firebaseConfig.json');

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const firebaseAuth = app.auth();

module.exports = { firebaseAuth };
