const modelRoutes = require("./model.route");
const authRoutes = require("./auth.route");
const historyRoutes = require("./history.route");
module.exports = (app) => {
    const domain = "/api";
    app.use(domain + "/models", modelRoutes);
    app.use(domain + "/auth", authRoutes);
    app.use(domain + "/history", historyRoutes);
};