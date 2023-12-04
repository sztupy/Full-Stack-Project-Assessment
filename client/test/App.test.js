import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
// Uncomment when you link the backend and frontend together
// import fetchMock from "fetch-mock-jest";

import App from "../src/App";

describe("Main Page", () => {
	beforeEach(async () => {
		// Uncomment when you link the backend and frontend together
		// fetchMock.reset();
		// fetchMock.get("/api/videos?order=id", {
		// 	success: true,
		// 	data: [
		// 		{
		// 			id: 1,
		// 			title: "Never Gonna Give You Up",
		// 			url: "https://www.youtube.com/watch?v=ABCDEFGHIJK",
		// 			rating: 1234,
		// 		},
		// 		{
		// 			id: 2,
		// 			title: "Other Title",
		// 			url: "https://www.youtube.com/watch?v=KJIHGFEDCBA",
		// 			rating: 4321,
		// 		},
		// 	],
		// });

		render(<App />);

		await screen.findByText("Never Gonna Give You Up");
	});

	it("Renders the videos", async () => {
		const videoContainers = screen.getAllByText(
			(_, e) => e.tagName.toLowerCase() === "iframe"
		);

		expect(videoContainers.length).toBe(10);
	});

	it("Removes the video when asked to do", async () => {
		// Uncomment when you link the backend and frontend together
		// fetchMock.delete("/api/videos/1", { success: true });

		const videoContainersBeforeDelete = screen.getAllByText(
			(_, e) => e.tagName.toLowerCase() === "iframe"
		);

		const deleteButton = screen.getAllByText("Remove video")[0];

		await act(async () => {
			fireEvent.click(deleteButton);
		});

		const videoContainers = screen.getAllByText(
			(_, e) => e.tagName.toLowerCase() === "iframe"
		);

		expect(videoContainers.length).toBe(videoContainersBeforeDelete.length - 1);
	});

	it("Adds a new video when asked to do", async () => {
		// Uncomment when you link the backend and frontend together
		// fetchMock.post("/api/videos", {
		// 	success: true,
		// 	data: {
		// 		id: 3,
		// 		title: "New Title",
		// 		url: "https://www.youtube.com/watch?v=CDEYRFUTURE",
		// 		rating: 0,
		// 	},
		// });

		const videoContainersBeforeAdd = screen.getAllByText(
			(_, e) => e.tagName.toLowerCase() === "iframe"
		);

		fireEvent.change(screen.getByRole("textbox", { name: "Title:" }), {
			target: { value: "New Title" },
		});
		fireEvent.change(screen.getByRole("textbox", { name: "Url:" }), {
			target: { value: "https://www.youtube.com/watch?v=CDEYRFUTURE" },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "Submit" }));
		});

		await screen.findByText("New Title");

		const videoContainers = screen.getAllByText(
			(_, e) => e.tagName.toLowerCase() === "iframe"
		);

		expect(videoContainers.length).toBe(videoContainersBeforeAdd.length + 1);

		// Uncomment when you link the backend and frontend together
		// expect(fetchMock).toHaveFetched("matched", {
		// 	method: "post",
		// 	url: "/api/videos",
		// 	body: {
		// 		title: "New Title",
		// 		url: "https://www.youtube.com/watch?v=CDEYRFUTURE",
		// 	},
		// });
	});
});
