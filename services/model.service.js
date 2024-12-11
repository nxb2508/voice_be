const db = require("../firebase-config").db;

module.exports.getModels = async () => {
  const modelsCollection = db.collection("models");
  const snapshot = await modelsCollection.get();
  const models = snapshot.docs
    .filter((doc) => !doc.data().hasOwnProperty("user_id"))
    .map((doc) => ({ id: doc.id, ...doc.data() }));
  return models;
};

module.exports.getModelByUserId = async (userId) => {
  const modelsCollection = db.collection("models");
  const snapshot = await modelsCollection.where("user_id", "==", userId).get();
  const models = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return models;
};


