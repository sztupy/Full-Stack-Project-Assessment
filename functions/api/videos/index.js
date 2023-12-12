// source: https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function youtubeLinkParser(url) {
	let regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	let match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}

export async function onRequestGet(ctx) {
	try {
		const query = new URLSearchParams(ctx.url);
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

		const { results } = await ctx.env.db
			.prepare("SELECT * FROM videos " + orderString)
			.all();
		return new Response(
			JSON.stringify({
				success: true,
				total: results.length,
				data: results,
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Could not finish action!",
				error: error.message,
				stack: error.stack,
			}),
			{ status: 500 }
		);
	}
}

export async function onRequestPost(ctx) {
	try {
		const body = await ctx.request.json();
		if (!body.url || !body.title || !youtubeLinkParser(body.url)) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Missing or invalid input!",
				}),
				{ status: 422 }
			);
		}

		const insert = await ctx.env.db
			.prepare(
				"INSERT INTO videos (title,url,rating) VALUES (?,?,?) RETURNING id"
			)
			.bind(body.title, body.url, 0)
			.all();
		const insertResult = insert.results;

		if (insertResult.length !== 1) {
			return new Response(
				JSON.stringify({
					success: false,
					message:
						"Server error during video creation, please reload the page!",
				}),
				{ status: 500 }
			);
		}

		const id = insertResult[0].id;
		const { results } = await ctx.env.db
			.prepare("SELECT * FROM videos WHERE id = ?")
			.bind(id)
			.all();
		if (results.length !== 1) {
			return new Response(
				JSON.stringify({
					success: false,
					message:
						"Server error during video creation, please reload the page!",
				}),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify({ success: true, data: results[0] }), {
			status: 201,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Could not finish action!",
				error: error.message,
				stack: error.stack,
			}),
			{ status: 500 }
		);
	}
}
