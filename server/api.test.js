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

			it("Returns the list of videos ordered by rating ascending", async () => {
				const response = await request(app).get("/api/videos?order=rating_asc");

				expect(response.statusCode).toBe(200);
				expect(response.body.data.length).toBe(10);
				expect(response.body.success).toBe(true);
				expect(response.body.data[0].title).toBe(
					"Videos for Cats to Watch - 8 Hour Bird Bonanza"
				);
				expect(response.body.data[0].url).toBe(
					"https://www.youtube.com/watch?v=xbs7FT7dXYc"
				);
				expect(response.body.data[0].rating).toBe(11);
			});

			it("Returns the list of videos ordered by rating descending", async () => {
				const response = await request(app).get(
					"/api/videos?order=rating_desc"
				);

				expect(response.statusCode).toBe(200);
				expect(response.body.data.length).toBe(10);
				expect(response.body.success).toBe(true);
				expect(response.body.data[9].title).toBe(
					"Videos for Cats to Watch - 8 Hour Bird Bonanza"
				);
				expect(response.body.data[9].url).toBe(
					"https://www.youtube.com/watch?v=xbs7FT7dXYc"
				);
				expect(response.body.data[9].rating).toBe(11);
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

			it("Does not create a video for invalid urls", async () => {
				const response = await request(app).post("/api/videos").send({
					title: "New Title",
					url: "https://www.youtube.com/watch?v=ABCDEFGHIJ",
				});

				expect(response.statusCode).toBe(422);
				expect(response.body.success).toBe(false);
			});
		});

		describe("/:id", () => {
			describe("GET", () => {
				it("Gets the video from the database if the id exists", async () => {
					const response = await request(app).get("/api/videos/1");

					expect(response.statusCode).toBe(200);
					expect(response.body.success).toBe(true);
					expect(response.body.data.title).toBe("Never Gonna Give You Up");
					expect(response.body.data.url).toBe(
						"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
					);
					expect(response.body.data.rating).toBe(23);
				});

				it("Returns 404 if the id doesn't exist", async () => {
					const response = await request(app).get("/api/videos/999999");

					expect(response.statusCode).toBe(404);
					expect(response.body.success).toBe(false);
				});
			});

			describe("DELETE", () => {
				it("Returns a successful response if the id exists", async () => {
					const response = await request(app).delete("/api/videos/1");

					expect(response.statusCode).toBe(200);
					expect(response.body.success).toBe(true);
				});

				it("Deletes the video from the database if the id exists", async () => {
					await request(app).delete("/api/videos/1");

					const dbResponse = await db.query(
						"SELECT * FROM videos WHERE id = $1",
						[1]
					);
					expect(dbResponse.rows.length).toBe(0);
				});

				it("Returns 404 if the id doesn't exist", async () => {
					const response = await request(app).delete("/api/videos/999999");

					expect(response.statusCode).toBe(404);
					expect(response.body.success).toBe(false);
				});
			});

			describe("/:action", () => {
				describe("POST", () => {
					it("Updates the rating up", async () => {
						const response = await request(app).post("/api/videos/1/up");

						expect(response.statusCode).toBe(200);
						expect(response.body.success).toBe(true);
						expect(response.body.data.rating).toBe(24);
					});

					it("Updates the rating down", async () => {
						const response = await request(app).post("/api/videos/1/down");

						expect(response.statusCode).toBe(200);
						expect(response.body.success).toBe(true);
						expect(response.body.data.rating).toBe(22);
					});

					it("Updates the rating in the database", async () => {
						await request(app).post("/api/videos/1/up");

						const dbResponse = await db.query(
							"SELECT * FROM videos WHERE id = $1",
							[1]
						);

						expect(dbResponse.rows[0].rating).toBe(24);
					});

					it("Returns 422 if the action is invalid", async () => {
						const response = await request(app).post("/api/videos/1/left");

						expect(response.statusCode).toBe(422);
						expect(response.body.success).toBe(false);
					});

					it("Returns 404 if the id doesn't exist", async () => {
						const response = await request(app).post("/api/videos/999999/up");

						expect(response.statusCode).toBe(404);
						expect(response.body.success).toBe(false);
					});
				});
			});
		});
	});
});
