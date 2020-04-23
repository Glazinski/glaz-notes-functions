const functions = require('firebase-functions');

const app = require('express')();
const cors = require('cors');

const FBAuth = require('./utils/fbAuth');

const {
  uploadImage,
  deleteImage
} = require('./handlers/users');

app.use(cors({ origin: true }));
app.post('/notes/image', FBAuth, uploadImage);
app.delete('/notes/image/delete', FBAuth, deleteImage);

exports.api = functions.region('europe-west3').https.onRequest(app);