const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/me", authMiddleware.authentication, historyController.index);
router.patch("/edit/:id", authMiddleware.authentication, historyController.editHistory);
router.delete("/delete/:id", authMiddleware.authentication, historyController.deleteHistory);

module.exports = router;