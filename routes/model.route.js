const express = require("express");
// const multer = require("multer");
const router = express.Router();
const modelController = require("../controllers/model.controller")
const authMiddleware = require("../middlewares/auth.middleware")
// const upload = multer();

router.get("/", modelController.index);
router.get("/me", authMiddleware.authentication, modelController.getModelByUserId);
router.get("/train", authMiddleware.authentication, modelController.trainModel);

module.exports = router;