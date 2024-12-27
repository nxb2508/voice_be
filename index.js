const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const routes = require("./routes/index.route");
routes(app);

const port = process.env.PORT;
app.listen(port, () => console.log(`Example app listening on port ${port}`));
