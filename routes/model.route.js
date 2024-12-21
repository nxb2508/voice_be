const express = require("express");
const multer = require("multer");
const router = express.Router();
const modelController = require("../controllers/model.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = multer();

router.get("/", modelController.index);
router.get("/me", authMiddleware.authentication, modelController.getModelByUserId);
router.get("/training", authMiddleware.authentication, modelController.getModelTraining);
router.patch("/edit/:id", authMiddleware.authentication, modelController.editModel);
router.delete("/delete/:id", authMiddleware.authentication, modelController.deleteModel);
router.post("/train", authMiddleware.authentication, upload.single("file"), modelController.trainModel);

module.exports = router;