import { render, screen, act } from "@testing-library/react";
import { server } from "./tests/setupTests.js";
import { http, HttpResponse } from "msw";

import App from "./App.jsx";

let updateVideoFunction = null;
let addVideoFunction = null;
let videosList = null;

vi.mock("../src/components/VideoList", () => ({
	default: function VideoList({ videos, updateVideo }) {
		updateVideoFunction = updateVideo;
		videosList = videos;
		return (
			<mock-video-list data-testid="video-list">
				{videos.map((v) => (
					<div key={v.id}>{v.title}</div>
				))}
			</mock-video-list>
		);
	},
}));
vi.mock("../src/components/VideoSubmission", () => ({
	default: function VideoSubmission({ addVideo }) {
		addVideoFunction = addVideo;
		return <mock-video-submission data-testid="video-submission" />;
	},
}));

describe("AddVideo", () => {
	beforeEach(async () => {
		server.use(
			http.get("/api/videos", () =>
				HttpResponse.json({
					success: true,
					data: [],
				})
			)
		);
		render(<App />);

		await screen.findByText("Video Recommendations");
	});

	it("Adds the new video to the list", async () => {
		server.use(
			http.post("/api/videos", async ({ request }) => {
				const data = await request.json();
				if (data.title != "TheNewTitle" || data.url != "Url") {
					return HttpResponse.json({ success: false });
				}
				return HttpResponse.json({
					success: true,
					data: {
						id: 1,
						title: "TheNewTitle",
						url: "Url",
						rating: 0,
					},
				});
			})
		);

		await act(async () => await addVideoFunction("TheNewTitle", "Url"));

		expect(videosList).toHaveLength(1);
		expect(videosList[0].title).toBe("TheNewTitle");
	});

	it("Shows an error message in case something went wrong", async () => {
		server.use(
			http.post("/api/videos", async () => {
				return HttpResponse.json({ success: false, message: "The Message" });
			})
		);

		await act(async () => await addVideoFunction("Title", "Url"));

		expect(screen.getByText("The Message")).toBeInTheDocument();
	});
});

describe("UpdateVideo", () => {
	beforeEach(async () => {
		server.use(
			http.get("/api/videos", () =>
				HttpResponse.json({
					success: true,
					data: [{ id: 1, title: "The Title", url: "Url", rating: 10 }],
				})
			)
		);

		render(<App />);

		await screen.findByText("The Title");
	});

	["up", "down"].forEach((action) => {
		describe(`Using action ${action}`, () => {
			it("Updates the rank of the video", async () => {
				server.use(
					http.post("/api/videos/1/" + action, async () =>
						HttpResponse.json({ success: true, data: { id: 1, rating: 11 } })
					)
				);

				await act(async () => await updateVideoFunction({ id: 1 }, action));

				expect(videosList).toHaveLength(1);
				expect(videosList[0].rating).toBe(11);
			});

			it("Sets an error message in case there are issues", async () => {
				server.use(
					http.post("/api/videos/1/" + action, async () =>
						HttpResponse.json({ success: false, message: "Not okay" })
					)
				);

				await act(async () => await updateVideoFunction({ id: 1 }, action));

				expect(videosList).toHaveLength(1);
				expect(videosList[0].message).toBe("Not okay");
			});
		});
	});

	describe("Using action delete", () => {
		it("Removes the video from the list", async () => {
			server.use(
				http.delete("/api/videos/1", () => HttpResponse.json({ success: true }))
			);

			await act(async () => await updateVideoFunction({ id: 1 }, "delete"));

			expect(videosList).toHaveLength(0);
		});

		it("Sets an error message in case there are issues", async () => {
			server.use(
				http.delete("/api/videos/1", () =>
					HttpResponse.json({ success: false, message: "Not okay" })
				)
			);

			await act(async () => await updateVideoFunction({ id: 1 }, "delete"));

			expect(videosList).toHaveLength(1);
			expect(videosList[0].message).toBe("Not okay");
		});
	});
});
