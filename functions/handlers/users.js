const { admin, db } = require("../utils/admin");
const { uuid } = require("uuidv4");

const config = require('../utils/fbConfig');

const firebase = require('firebase');
firebase.initializeApp(config);

exports.uploadImage = (req, res) => {
  const Busboy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  const noteId = req.headers.noteid;
  const coll = req.headers.coll;

  const busboy = new Busboy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  // String for image token
  let generatedToken = uuid();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            // Generate token to be appended to imageUrl
            firebaseStorageDownloadTokens: generatedToken,
            filename: imageFileName
          },
        },
      })
      .then(() => {
        // Append token to url
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}&filename=${imageFileName}`;
        return db.doc(`/${coll}/${req.user.uid}/userNotes/${noteId}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

exports.deleteImage = (req, res) => {
  const queryString = require('query-string');
  const imageUrl = queryString.parseUrl(req.body.imageUrl).query.filename;

  admin
    .storage()
    .bucket()
    .file(imageUrl)
    .delete()
    .then(() => {
      return res.json({ message: "image deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "something went wrong" });
    })
};