const modelService = require("../services/model.service");
const axios = require("axios");
const FormData = require("form-data");
const db = require("../firebase-config").db;

module.exports.index = async (req, res) => {
  try {
    const models = await modelService.getModels();
    res.json(models);
  } catch (error) {
    res.json({
      message: error,
    });
  }
};

module.exports.getModelByUserId = async (req, res) => {
  try {
    const models = await modelService.getModelByUserId(req.user.uid);
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports.trainModel = async (req, res) => {
  try {
    const { name, f0_method } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Kiểm tra xem uid đã tồn tại trong Firestore chưa
    const userDoc = (await db.collection("users").where("uid", "==", req.user.uid).get()).docs;
    if(userDoc.length > 0){
      return res.status(200).json({
        message: "training"
      })
    }

    await db.collection("users").add({
      uid: req.user.uid,
      createdAt: new Date(),
    });

    const formData = new FormData();
    formData.append("user_id", req.user.uid);
    formData.append("file", file.buffer, file.originalname);
    formData.append("name", name);
    formData.append("f0_method", f0_method);
    formData.append("epochs_number", 100);

    const apiUrl = "https://voice.dinhmanhhung.net/train-model/";
    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const allUserDocs = (await db.collection("users").where("uid", "==", req.user.uid).get()).docs;
    const deletePromises = allUserDocs.map((doc) => db.collection("users").doc(doc.id).delete());
    await Promise.all(deletePromises);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
