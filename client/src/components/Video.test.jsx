import { render, screen, fireEvent } from "@testing-library/react";

import Video from "./Video";

const video = {
	id: 1,
	title: "The Title",
	url: "https://www.youtube.com/watch?v=ABCDEFGHIJK",
};
let deleteVideoMock = null;

describe("Video component", () => {
	beforeEach(async () => {
		deleteVideoMock = vi.fn();

		render(<Video video={video} deleteVideo={deleteVideoMock} />);

		await screen.findByText("The Title");
	});

	describe("Rendering", () => {
		it("Renders the title", async () => {
			expect(screen.getByText("The Title")).toBeInTheDocument();
		});

		it("Renders the video", async () => {
			expect(screen.getByTitle("The Title").src).toBe(
				"https://www.youtube.com/embed/ABCDEFGHIJK"
			);
		});
	});

	describe("Actions", () => {
		it("Renders the delete button", async () => {
			expect(
				screen.getByRole("button", { name: "Remove video" })
			).toBeInTheDocument();
		});

		it("Calls the delete action when pressed", async () => {
			fireEvent.click(screen.getByRole("button", { name: "Remove video" }));

			expect(deleteVideoMock).toHaveBeenCalledWith(video);
		});
	});
});
