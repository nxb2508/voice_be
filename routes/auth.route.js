const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")

router.post("/verify-token", authController.auth);

module.exports = router;