export async function onRequestGet(ctx) {
	try {
		const { results } = await ctx.env.db
			.prepare("SELECT * FROM videos WHERE id = ?")
			.bind(ctx.params.video)
			.all();
		if (results.length !== 1) {
			return new Response(
				JSON.stringify({ success: false, message: "Could not find video" }),
				{ status: 404 }
			);
		}

		return new Response(JSON.stringify({ success: true, data: results[0] }), {
			status: 200,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Could not obtain video!",
				error: error.message,
				stack: error.stack,
			}),
			{ status: 500 }
		);
	}
}

export async function onRequestDelete(ctx) {
	try {
		const { meta } = await ctx.env.db
			.prepare("DELETE FROM videos WHERE id = ?")
			.bind(ctx.params.video)
			.run();
		if (meta.rows_written !== 1) {
			return new Response(
				JSON.stringify({ success: false, message: "Could not find video" }),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({ success: true, message: "Video deleted" }),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Could not obtain video!",
				error: error.message,
				stack: error.stack,
			}),
			{ status: 500 }
		);
	}
}
