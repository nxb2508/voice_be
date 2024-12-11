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

const port = process.env.PORT;
app.listen(port, () => console.log(`Example app listening on port ${port}`));
