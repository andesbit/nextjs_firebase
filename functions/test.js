const { onRequest } = require("firebase-functions/v2/https");

exports.testFunc = onRequest((req, res) => {
  res.json({ message: "Hello from Firebase Functions v2!" });
});