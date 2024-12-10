const modelService = require("../services/model.service")
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