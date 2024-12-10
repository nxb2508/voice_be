const db = require("../firebase-config").db

module.exports.getModels = async () => {
    const modelsCollection = db.collection("models");
    const snapshot = await modelsCollection.get();
    const models = [];
    snapshot.forEach((doc) => {
      models.push({ id: doc.id, ...doc.data() });
    });
    return models
};
