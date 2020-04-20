const functions = require('firebase-functions');

const app = require('express')();

const { admin, db } = require('./utils/admin');

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.get('/test', (req, res) => {
  console.log(req.headers.authorization);
  res.send(req.headers.authorization);
  // response.send("Hello from Firebase!");
});

exports.api = functions.region('europe-west3').https.onRequest(app);