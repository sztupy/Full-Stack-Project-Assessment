export default function OrderingSelector({ order, setOrder }) {
	return (
		<div className="order-selector">
			<h3>Select order of videos</h3>
			<ul>
				<li>
					<button
						disabled={order == "rating_asc"}
						onClick={() => setOrder("rating_asc")}
						title="Ascending by vote"
					>
						⬆️
					</button>
				</li>
				<li>
					<button
						disabled={order == "rating_desc"}
						onClick={() => setOrder("rating_desc")}
						title="Descending by vote"
					>
						⬇️
					</button>
				</li>
				<li>
					<button
						disabled={order == "id"}
						onClick={() => setOrder("id")}
						title="Creation order"
					>
						➡️
					</button>
				</li>
				<li>
					<button
						disabled={order == "random"}
						onClick={() => setOrder("random")}
						title="Random order"
					>
						🔀
					</button>
				</li>
			</ul>
		</div>
	);
}
