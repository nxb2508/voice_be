const express = require("express");
// const multer = require("multer");
const router = express.Router();
const modelController = require("../controllers/model.controller")
const authMiddleware = require("../middlewares/auth.middleware")
// const upload = multer();

router.get("/", authMiddleware.authentication, modelController.index);

module.exports = router;