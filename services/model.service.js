const db = require("../firebase-config").db;

module.exports.getModels = async () => {
  const modelsCollection = db.collection("models");
  const snapshot = await modelsCollection.get();
  const models = snapshot.docs
    .filter((doc) => !doc.data().hasOwnProperty("user_id"))
    .map((doc) => ({ id: doc.id, ...doc.data() }));
  const categoriesSnapshot = await db.collection("category").get();
  const categories = categoriesSnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name;
    return acc;
  }, {});
  const modelsWithCategory = models.map((model) => ({
    ...model,
    category_name: categories[model.category] || "Unknown Category",
  }));
  return modelsWithCategory;
};

module.exports.getModelByUserId = async (userId) => {
  const modelsCollection = db.collection("models");
  const snapshot = await modelsCollection.where("user_id", "==", userId).get();
  const models = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const categoriesSnapshot = await db.collection("category").get();
  const categories = categoriesSnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name;
    return acc;
  }, {});
  const modelsWithCategory = models.map((model) => ({
    ...model,
    category_name: categories[model.category] || "Unknown Category",
  }));
  return modelsWithCategory;
};

module.exports.getModelTraining = async (userId) => {
  const modelsCollection = db.collection("models_training");
  const snapshot = await modelsCollection.where("uid", "==", userId).get();
  const models = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return models;
};

module.exports.editModel = async (id, updateData) => {
  // Tham chiếu đến document của model cần cập nhật
  const modelRef = db.collection("models").doc(id);

  // Kiểm tra model có tồn tại không
  const modelSnapshot = await modelRef.get();
  if (!modelSnapshot.exists) {
    return res.status(404).json({ message: "Model not found" });
  }

  // Cập nhật dữ liệu
  await modelRef.update(updateData);

  return "Model updated successfully";
};
