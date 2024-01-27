import { Router } from "express";
import db from "./db.js";
const router = Router();
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";

// source: https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function youtubeLinkParser(url) {
	let regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	let match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}

function videoToJson(video) {
	return {
		id: video.id,
		url: video.url,
		title: video.title,
		rating: video.rating,
		created_at: video.created_at,
	};
}

router.get("/videos", async (req, res) => {
	try {
		let orderString = "ORDER BY id ASC";
		switch (req.query.order) {
			case "rating_asc":
				orderString = "ORDER BY rating ASC";
				break;
			case "rating_desc":
				orderString = "ORDER BY rating DESC";
				break;
			case "random":
				orderString = "ORDER BY random()";
				break;
		}
		const result = await db.query("SELECT * FROM videos " + orderString);
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

router.get("/videos/:id", async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM videos WHERE id = $1", [
			req.params.id,
		]);
		if (result.rows.length !== 1) {
			return res
				.status(404)
				.json({ success: false, message: "Could not find video" });
		}

		res.status(200).json({ success: true, data: videoToJson(result.rows[0]) });
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Could not obtain video!" });
	}
});

router.post("/videos/:id/:action", async (req, res) => {
	try {
		if (req.params.action !== "up" && req.params.action !== "down") {
			return res
				.status(422)
				.json({ success: false, message: "Invalid action" });
		}

		const result = await db.query("SELECT * FROM videos WHERE id = $1", [
			req.params.id,
		]);
		if (result.rows.length !== 1) {
			return res
				.status(404)
				.json({ success: false, message: "Could not find video" });
		}

		const operator = req.params.action == "up" ? "+" : "-";

		const updateResult = await db.query(
			`UPDATE videos SET rating = rating ${operator} 1 WHERE id = $1 RETURNING *`,
			[req.params.id]
		);

		if (updateResult.rows.length !== 1) {
			return res
				.status(500)
				.json({ success: false, message: "Error while updating rating" });
		}

		res
			.status(200)
			.json({ success: true, data: videoToJson(updateResult.rows[0]) });
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Could not update video!" });
	}
});

router.delete("/videos/:id", async (req, res) => {
	try {
		const result = await db.query("DELETE FROM videos WHERE id = $1", [
			req.params.id,
		]);
		if (result.rowCount !== 1) {
			return res
				.status(404)
				.json({ success: false, message: "Could not find video" });
		}

		res.status(200).json({ success: true, message: "Video deleted" });
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Could not delete video!" });
	}
});

router.post("/videos", async (req, res) => {
	try {
		const body = req.body;
		if (!body.url || !body.title || !youtubeLinkParser(body.url)) {
			return res
				.status(422)
				.json({ success: false, message: "Missing or invalid input!" });
		}

		const insertResult = await db.query(
			"INSERT INTO videos (title,url,rating) VALUES ($1,$2,$3) RETURNING id",
			[body.title, body.url, 0]
		);
		if (insertResult.rows.length !== 1) {
			return res.status(500).json({
				success: false,
				message: "Server error during video creation, please reload the page!",
			});
		}

		const id = insertResult.rows[0].id;
		const result = await db.query("SELECT * FROM videos WHERE id = $1", [id]);
		if (result.rows.length !== 1) {
			return res.status(500).json({
				success: false,
				message: "Server error during video creation, please reload the page!",
			});
		}

		res.status(201).json({ success: true, data: videoToJson(result.rows[0]) });
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Could not create video!" });
	}
});

router.post("/videos/reset", async (req, res) => {
	try {
		const body = req.body;
		if (body.code !== process.env.RESET_CODE) {
			return res.status(403).json({ success: false, message: "Unauthorized!" });
		}

		let initDbLocation;
		if (!process.env.LAMBDA_TASK_ROOT) {
			const __dirname = path.dirname(fileURLToPath(import.meta.url));
			initDbLocation = path.resolve(__dirname, "../db/initdb.sql");
		} else {
			initDbLocation = path.resolve(
				process.env.LAMBDA_TASK_ROOT,
				"db/initdb.sql"
			);
		}

		const schemaSql = await readFile(initDbLocation, "utf8");
		await db.query(schemaSql);
		return res.status(200).json({ success: true, message: "OK" });
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Could not reset database!" });
	}
});

export default router;
