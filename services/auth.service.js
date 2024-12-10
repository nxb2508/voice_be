const admin = require("../firebase-config").admin

module.exports.verifyIdToken = async (idToken) => {
  try {
    await admin.auth().verifyIdToken(idToken);
    return idToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new Error("Invalid ID token");
  }
};
