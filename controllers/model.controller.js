const modelService = require("../services/model.service")
const axios = require('axios');
module.exports.index = async (req, res) => {
    try {
        const models = await modelService.getModels()
        res.json(models)
    } catch (error) {
        res.json({
            message: error
        })
    }
}

module.exports.getModelByUserId = async (req, res) => {
    try {
        const models = await modelService.getModelByUserId(req.user.uid)
        res.status(200).json(models)
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports.trainModel = async (req, res) => {
    try {
        const { name, f0_method } = req.body;
        const file = req.file;
    
        if (!file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
    
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);
        formData.append("name", name);
        formData.append("f0_method", f0_method);
    
        const apiUrl = "http://your-python-api-url/train-model";
        const response = await axios.post(apiUrl, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });
    
        res.status(response.status).json(response.data);
      } catch (error) {
        console.error("Error forwarding to Python API:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
}