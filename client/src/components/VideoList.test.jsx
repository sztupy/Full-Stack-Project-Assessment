import { render, screen } from "@testing-library/react";

import VideoList from "./VideoList";

const videos = [
	{
		id: 1,
		title: "The Title",
		url: "https://www.youtube.com/watch?v=ABCDEFGHIJK",
	},
	{
		id: 2,
		title: "Other Title",
		url: "https://www.youtube.com/watch?v=ABCDEFGHIJL",
	},
];

describe("List of videos", () => {
	beforeEach(async () => {
		render(<VideoList videos={videos} />);

		await screen.findByText("The Title");
	});

	describe("Rendering", () => {
		it("Renders the first video", async () => {
			expect(screen.getByText("The Title")).toBeInTheDocument();
		});

		it("Renders the second video", async () => {
			expect(screen.getByTitle("Other Title")).toBeInTheDocument();
		});
	});
});
