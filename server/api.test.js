import request from "supertest";
import app from "./app";
import db from "./db";

describe("/api", () => {
	describe("/videos", () => {
		describe("GET", () => {
			it("Returns the list of videos ordered by id", async () => {
				const response = await request(app).get("/api/videos");

				expect(response.statusCode).toBe(200);
				expect(response.body.data.length).toBe(10);
				expect(response.body.success).toBe(true);
				expect(response.body.data[0].title).toBe("Never Gonna Give You Up");
				expect(response.body.data[0].url).toBe(
					"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				);
				expect(response.body.data[0].rating).toBe(23);
			});
		});

		describe("POST", () => {
			it("Creates a new video for valid input", async () => {
				const response = await request(app).post("/api/videos").send({
					title: "New Title",
					url: "https://www.youtube.com/watch?v=ABCDEFGHIJK",
				});

				expect(response.statusCode).toBe(201);
				expect(response.body.success).toBe(true);
				expect(response.body.data.title).toBe("New Title");
				expect(response.body.data.url).toBe(
					"https://www.youtube.com/watch?v=ABCDEFGHIJK"
				);
				expect(response.body.data.rating).toBe(0);
			});

			it("Adds the new video to the database", async () => {
				await request(app).post("/api/videos").send({
					title: "New Title",
					url: "https://www.youtube.com/watch?v=ABCDEFGHIJK",
				});

				const dbResponse = await db.query(
					"SELECT * FROM videos ORDER BY id DESC LIMIT 1"
				);

				expect(dbResponse.rows[0].title).toBe("New Title");
				expect(dbResponse.rows[0].url).toBe(
					"https://www.youtube.com/watch?v=ABCDEFGHIJK"
				);
			});
		});
	});
});
