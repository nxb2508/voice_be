const historyService = require("../services/history.service");

module.exports.index = async (req, res) => {
  try {
    const histories = await historyService.get(req.user.uid);
    res.json(histories);
  } catch (error) {
    res.json({
      message: error,
    });
  }
};

module.exports.editHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      return res.status(400).json({ message: "History ID is required" });
    }
    const response = await historyService.edit(id, updateData);
    res.status(200).json({
      message: response,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports.deleteHistory = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "History ID is required" });
      }
      const response = await historyService.delete(id);
      res.status(200).json({
        message: response,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  };