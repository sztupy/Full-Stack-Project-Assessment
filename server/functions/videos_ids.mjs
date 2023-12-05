import db, { disconnectDb } from "../db";

export default async (req, ctx) => {
	try {
		if (req.method === "GET") {
			const result = await db.query("SELECT * FROM videos WHERE id = $1", [
				ctx.params.id,
			]);
			if (result.rows.length !== 1) {
				return new Response(
					JSON.stringify({ success: false, message: "Could not find video" }),
					{ status: 404 }
				);
			}

			return new Response(
				JSON.stringify({ success: true, data: result.rows[0] }),
				{ status: 200 }
			);
		} else if (req.method === "DELETE") {
			const result = await db.query("DELETE FROM videos WHERE id = $1", [
				ctx.params.id,
			]);
			if (result.rowCount !== 1) {
				return new Response(
					JSON.stringify({ success: false, message: "Could not find video" }),
					{ status: 404 }
				);
			}

			return new Response(
				JSON.stringify({ success: true, message: "Video deleted" }),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid HTTP Method" }),
				{ status: 405 }
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: "Could not obtain video!", error: error.message, stack: error.stack }),
			{ status: 500 }
		);
	} finally {
		disconnectDb();
	}
};

export const config = {
	path: ["/api/videos/:id"],
};
