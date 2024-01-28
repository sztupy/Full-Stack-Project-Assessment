// @ts-ignore
import express from "express";
import serverless from "serverless-http";
// @ts-ignore
import apiRouter from "../api.js";

const app = express();

app.use(express.json());
app.use("/api/", apiRouter);

export const handler = serverless(app);