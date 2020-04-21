const functions = require('firebase-functions');

const app = require('express')();
const cors = require('cors');

const { admin, db } = require('./utils/admin');

const FBAuth = require('./utils/fbAuth');

const {
  uploadImage
} = require('./handlers/users');

app.use(cors({ origin: true }));
app.post('/test', FBAuth, uploadImage);

exports.api = functions.region('europe-west3').https.onRequest(app);