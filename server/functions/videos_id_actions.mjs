import db, { disconnectDb } from "../db";

export default async (req, ctx) => {
	if (req.method !== "POST") {
		return new Response(
			JSON.stringify({ success: false, message: "Invalid HTTP Method" }),
			{ status: 405 }
		);
	}

	try {
		if (ctx.params.action !== "up" && ctx.params.action !== "down") {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid action!" }),
				{ status: 422 }
			);
		}

		const result = await db.query("SELECT * FROM videos WHERE id = $1", [
			ctx.params.id,
		]);
		if (result.rows.length !== 1) {
			return new Response(
				JSON.stringify({ success: false, message: "Could not find video!" }),
				{ status: 404 }
			);
		}

		const operator = ctx.params.action == "up" ? "+" : "-";

		const updateResult = await db.query(
			`UPDATE videos SET rating = rating ${operator} 1 WHERE id = $1 RETURNING *`,
			[ctx.params.id]
		);

		if (updateResult.rows.length !== 1) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Error while updating rating",
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({ success: true, data: updateResult.rows[0] }),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: "Could not update video!", error: error.message, stack: error.stack }),
			{ status: 500 }
		);
	} finally {
		disconnectDb();
	}
};

export const config = {
	path: ["/api/videos/:id/:action"],
};
