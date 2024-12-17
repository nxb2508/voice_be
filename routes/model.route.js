const express = require("express");
const multer = require("multer");
const router = express.Router();
const modelController = require("../controllers/model.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = multer();

router.get("/", modelController.index);
router.get("/me", authMiddleware.authentication, modelController.getModelByUserId);
router.post("/train", authMiddleware.authentication, upload.single("file"), modelController.trainModel);

module.exports = router;