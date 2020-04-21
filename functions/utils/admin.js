const admin = require('firebase-admin');
// const serviceAccount = require('../config/serviceAccountKey.json');
const test = require('../config/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(test),
  // databaseURL: "https://glaz-notes-269221.firebaseio.com",
  storageBucket: 'gs://glaz-notes-269221.appspot.com'
});

const db = admin.firestore();

module.exports = { admin, db };