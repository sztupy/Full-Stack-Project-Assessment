export async function onRequestPost(ctx) {
	try {
		if (ctx.params.action !== "up" && ctx.params.action !== "down") {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid action!" }),
				{ status: 422 }
			);
		}

		const { results } = await ctx.env.db
			.prepare("SELECT * FROM videos WHERE id = ?")
			.bind(ctx.params.video)
			.all();
		if (results.length !== 1) {
			return new Response(
				JSON.stringify({ success: false, message: "Could not find video!" }),
				{ status: 404 }
			);
		}

		const operator = ctx.params.action == "up" ? "+" : "-";

		const update = await ctx.env.db
			.prepare(
				`UPDATE videos SET rating = rating ${operator} 1 WHERE id = ? RETURNING *`
			)
			.bind(ctx.params.video)
			.all();
		const updateResult = update.results;

		if (updateResult.length !== 1) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Error while updating rating",
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({ success: true, data: updateResult[0] }),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Could not update video!",
				error: error.message,
				stack: error.stack,
			}),
			{ status: 500 }
		);
	}
}
