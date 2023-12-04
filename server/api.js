import { Router } from "express";
//import db from "./db";

const router = Router();

router.get("/videos", async (_, res) => {
	res.status(200).json([]);
});

export default router;
