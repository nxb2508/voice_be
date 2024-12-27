const admin = require("../firebase-config").admin
module.exports.authentication = async (req, res, next) => {
  const idToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!idToken) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authenticationInfer = async (req, res, next) => {
  const idToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
    } catch (error) {
      console.error("Error verifying ID token:", error);
    }
  }
  next()
};
