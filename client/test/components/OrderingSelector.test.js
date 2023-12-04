import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import OrderingSelector from "../../src/components/OrderingSelector";

describe("Ordering selector", () => {
	let order = "id";
	let setOrder;

	beforeEach(async () => {
		setOrder = jest.fn();
		render(<OrderingSelector order={order} setOrder={setOrder} />);

		await screen.findByTitle("Ascending by vote");
	});

	describe("Rendering", () => {
		it("Renders the buttons", async () => {
			expect(screen.getByTitle("Ascending by vote")).toBeInTheDocument();
			expect(screen.getByTitle("Descending by vote")).toBeInTheDocument();
			expect(screen.getByTitle("Creation order")).toBeInTheDocument();
			expect(screen.getByTitle("Random order")).toBeInTheDocument();
		});

		describe("id is selected", () => {
			beforeAll(() => {
				order = "id";
			});

			it("Shows the selected button as disabled", async () => {
				expect(screen.getByTitle("Creation order").disabled).toBe(true);
			});

			it("Shows the other buttons as active", async () => {
				expect(screen.getByTitle("Ascending by vote").disabled).toBe(false);
				expect(screen.getByTitle("Descending by vote").disabled).toBe(false);
				expect(screen.getByTitle("Random order").disabled).toBe(false);
			});

			it("Sets the order when clicked", async () => {
				await screen.getByTitle("Ascending by vote").click();

				expect(setOrder).toHaveBeenCalledWith("rating_asc");

				await screen.getByTitle("Descending by vote").click();

				expect(setOrder).toHaveBeenCalledWith("rating_desc");

				await screen.getByTitle("Random order").click();

				expect(setOrder).toHaveBeenCalledWith("random");
			});
		});

		describe("random is selected", () => {
			beforeAll(() => {
				order = "random";
			});

			it("Shows the selected button as disabled", async () => {
				expect(screen.getByTitle("Random order").disabled).toBe(true);
			});

			it("Sets the order when clicked", async () => {
				await screen.getByTitle("Creation order").click();

				expect(setOrder).toHaveBeenCalledWith("id");
			});
		});
	});
});
