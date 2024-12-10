const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();

const routes = require("./routes/index.route");
routes(app);

// app.get("/api/models/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const modelsCollection = db.collection("models");
//     const snapshot = await modelsCollection
//       .where("id_model", "==", parseInt(id))
//       .get();

//     const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error fetching model by ID:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// });
const port = process.env.PORT;
app.listen(port, () => console.log(`Example app listening on port ${port}`));
