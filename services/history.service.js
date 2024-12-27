const db = require("../firebase-config").db;
const fs = require("fs");
const path = require("path");

module.exports.get = async (id) => {
  const histories = (
    await db.collection("histories").where("user_id", "==", id).get()
  ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return histories;
};

module.exports.edit = async (id, updateData) => {
  const historyRef = db.collection("histories").doc(id);

  const historiesnapshot = await historyRef.get();
  if (!historiesnapshot.exists) {
    return res.status(404).json({ message: "History not found" });
  }

  await historyRef.update(updateData);

  return "History updated successfully";
};

module.exports.delete = async (id) => {
  const historyRef = db.collection("histories").doc(id);

  const historiesnapshot = await historyRef.get();
  if (!historiesnapshot.exists) {
    return res.status(404).json({ message: "History not found" });
  }

  await historyRef.delete();

  const fileName = path.basename(historiesnapshot.data().url_file); // Lấy tên file từ đường dẫn
  const filePath = path.join(__dirname, "../uploads", fileName); // Đường dẫn đầy đủ của file

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });
  return "History deleted successfully";
};
