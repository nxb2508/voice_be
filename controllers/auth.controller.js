const authService = require("../services/auth.service");
module.exports.auth = async (req, res) => {
  const { idToken } = req.body;
  try {
    const accessToken = await authService.verifyIdToken(idToken);
    res.status(200).json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
