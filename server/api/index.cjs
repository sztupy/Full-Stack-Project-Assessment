const express = require("express");
const serverless = require("serverless-http");
const apiRouter = require("../api.js");

const app = express();

app.use(express.json());
app.use("/api/", apiRouter);

module.exports = {
    handler: serverless(app)
}
