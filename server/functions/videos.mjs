import db, { disconnectDb } from "../db";

// source: https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function youtubeLinkParser(url) {
	let regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	let match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}

export default async (req, _) => {
	try {
		if (req.method === "GET") {
			const query = new URLSearchParams(req.url);
			let orderString = "ORDER BY id ASC";
			switch (query.get("order")) {
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
			return new Response(
				JSON.stringify({
					success: true,
					total: result.rows.length,
					data: result.rows,
				}),
				{ status: 200 }
			);
		} else if (req.method === "POST") {
			const body = await req.json();
			if (!body.url || !body.title || !youtubeLinkParser(body.url)) {
				return new Response(
					JSON.stringify({
						success: false,
						message: "Missing or invalid input!",
					}),
					{ status: 422 }
				);
			}

			const insertResult = await db.query(
				"INSERT INTO videos (title,url,rating) VALUES ($1,$2,$3) RETURNING id",
				[body.title, body.url, 0]
			);
			if (insertResult.rows.length !== 1) {
				return new Response(
					JSON.stringify({
						success: false,
						message:
							"Server error during video creation, please reload the page!",
					}),
					{ status: 500 }
				);
			}

			const id = insertResult.rows[0].id;
			const result = await db.query("SELECT * FROM videos WHERE id = $1", [id]);
			if (result.rows.length !== 1) {
				return new Response(
					JSON.stringify({
						success: false,
						message:
							"Server error during video creation, please reload the page!",
					}),
					{ status: 500 }
				);
			}

			return new Response(
				JSON.stringify({ success: true, data: result.rows[0] }),
				{ status: 201 }
			);
		} else {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid HTTP Method" }),
				{ status: 405 }
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: "Could not finish action!", error: error.message, stack: error.stack }),
			{ status: 500 }
		);
	} finally {
		disconnectDb();
	}
};

export const config = {
	path: ["/api/videos"],
};
