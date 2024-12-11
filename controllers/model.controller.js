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
        //example 
        const data = await axios.get('https://dummyjson.com/products')
        res.status(200).json(data.data)
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}