const { admin, db } = require("../utils/admin");

exports.uploadImage = (req, res) => {
  console.log(req.user.uid)
  res.json({ msg: 'eloo' });
};