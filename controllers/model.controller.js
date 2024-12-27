const modelService = require("../services/model.service");
const axios = require("axios");
const FormData = require("form-data");
const db = require("../firebase-config").db;
const fs = require('fs');
const path = require('path');

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

module.exports.getModelTraining = async (req, res) => {
  try {
    const models = await modelService.getModelTraining(req.user.uid);
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports.editModel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      return res.status(400).json({ message: "Model ID is required" });
    }
    const response = await modelService.editModel(id, updateData);
    res.status(200).json({
      message: response,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports.deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Model ID is required" });
    }
    await axios.delete(`https://voice.dinhmanhhung.net/models/${id}`);
    res.status(200).json({
      message: "Model deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports.trainModel = async (req, res) => {
  try {
    const { name, f0_method, epochs } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Kiểm tra xem uid đã tồn tại trong Firestore chưa
    const modelsTraining = (
      await db
        .collection("models_training")
        .where("uid", "==", req.user.uid)
        .get()
    ).docs;
    if (modelsTraining.length > 0) {
      return res.status(200).json({
        message: "One model is training",
      });
    }

    const trainAt = new Date();

    await db.collection("models_training").add({
      uid: req.user.uid,
      name: name,
      trainAt: trainAt,
    });

    const formData = new FormData();
    formData.append("user_id", req.user.uid);
    formData.append("file", file.buffer, file.originalname);
    formData.append("name", name);
    formData.append("f0_method", f0_method);
    formData.append("epochs_number", epochs);
    formData.append("trainAt", trainAt.toISOString());

    const apiUrl = "https://voice.dinhmanhhung.net/train-model/";
    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const allUserDocs = (
      await db
        .collection("models_training")
        .where("uid", "==", req.user.uid)
        .get()
    ).docs;
    const deletePromises = allUserDocs.map((doc) =>
      db.collection("models_training").doc(doc.id).delete()
    );
    await Promise.all(deletePromises);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    const allUserDocs = (
      await db
        .collection("models_training")
        .where("uid", "==", req.user.uid)
        .get()
    ).docs;
    const deletePromises = allUserDocs.map((doc) =>
      db.collection("models_training").doc(doc.id).delete()
    );
    await Promise.all(deletePromises);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports.textToSpeechAndInfer = async (req, res) => {
  try {
    const apiUrl = "https://voice.dinhmanhhung.net/text-to-speech-and-infer/";
    const response = await axios.post(apiUrl, req.body, {
      responseType: 'stream',
      headers: {
        "Content-Type": "application/json"
      },
    });
    const snap = await db.collection('models').doc(req.body.model_id).get()
    const nameModel = snap.data().name_model

    const now = Date.now();
    const outputFilePath = `./uploads/${nameModel}_text-to-speech-and-infer_${now}.wav`;

    const writer = fs.createWriteStream(outputFilePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const urlFile = `${req.protocol}://${req.get('host')}/uploads/${nameModel}_text-to-speech-and-infer_${now}.wav`;

    if (req.user) {
      await modelService.updateHistory(
        req.user.uid,
        `${nameModel}_text-to-speech-and-infer_${now}`,
        urlFile,
        req.body.model_id,
        new Date()
      );
    }

    res.status(200).json({
      url: urlFile
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports.inferAudio = async (req, res) => {
  try {
    const { model_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);
    formData.append("model_id", model_id);

    const snap = await db.collection('models').doc(model_id).get()
    const nameModel = snap.data().name_model
    const fileName = path.parse(file.originalname).name;

    const apiUrl = "https://voice.dinhmanhhung.net/infer-audio/";

    const response = await axios.post(apiUrl, formData, {
      responseType: 'stream',
      headers: {
        ...formData.getHeaders(),
      },
    });

    const outputFilePath = `./uploads/${nameModel}_infer_audio_${fileName}.wav`;
    const writer = fs.createWriteStream(outputFilePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const urlFile = `${req.protocol}://${req.get('host')}/uploads/${nameModel}_infer_audio_${fileName}.wav`;

    if (req.user) {
      await modelService.updateHistory(
        req.user.uid,
        `${nameModel}_infer_audio_${fileName}`,
        urlFile,
        model_id,
        new Date()
      );
    }

    res.status(200).json({
      url: urlFile
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports.textToSpeechFileAndInfer = async (req, res) => {
  try {
    const { model_id, locate } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);
    formData.append("model_id", model_id);
    formData.append("locate", locate);

    const snap = await db.collection('models').doc(model_id).get()
    const nameModel = snap.data().name_model
    const fileName = path.parse(file.originalname).name;

    const apiUrl = "https://voice.dinhmanhhung.net/text-file-to-speech-and-infer/";

    const response = await axios.post(apiUrl, formData, {
      responseType: 'stream',
      headers: {
        ...formData.getHeaders(),
      },
    });

    const outputFilePath = `./uploads/${nameModel}_text-file-to-speech-and-infer_${fileName}.wav`;
    const writer = fs.createWriteStream(outputFilePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const urlFile = `${req.protocol}://${req.get('host')}/uploads/${nameModel}_text-file-to-speech-and-infer_${fileName}.wav`;

    if (req.user) {
      await modelService.updateHistory(
        req.user.uid,
        `${nameModel}_text-file-to-speech-and-infer_${fileName}`,
        urlFile,
        model_id,
        new Date()
      );
    }

    res.status(200).json({
      url: urlFile
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
