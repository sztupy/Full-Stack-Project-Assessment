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
	try {
		const result = await db.query("SELECT * FROM videos");
		res.status(200).json({
			success: true,
			total: result.rows.length,
			data: result.rows.map(videoToJson),
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "Could not download the video list!" });
	}
});

export default router;
