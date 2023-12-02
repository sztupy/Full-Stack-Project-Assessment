import express from "express";
import serverless from "serverless-http";
import api from "../api";

const app = express();

app.use("/api/", api);

export const handler = serverless(app);
