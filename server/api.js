import { Router } from "express";
import db from "./db.js";
const router = Router();

function videoToJson(video) {
	return {
		id: video.id,
		url: video.url,
		title: video.title,
	};
}

router.get("/videos", async (_, res) => {
	const result = await db.query("SELECT * FROM videos");
	res.status(200).json(result.rows.map(videoToJson));
});

export default router;
