import { useState, useEffect } from "react";

import VideoList from "./components/VideoList";

const App = () => {
	let [videos, setVideos] = useState([]);
	let [message, setMessage] = useState(null);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const videoResults = await fetch(`/api/videos`);
				const videoResultsJson = await videoResults.json();
				if (videoResultsJson.success) {
					setVideos(videoResultsJson.data);
					setMessage(null);
				} else {
					setMessage(
						videoResultsJson.message ||
							"Error while loading video recommendations, please try again by reloading the page!"
					);
				}
			} catch (error) {
				setMessage(
					"Error while loading video recommendations, please try again by reloading the page!"
				);
			}
		};
		fetchVideos();
	}, [setVideos, setMessage]);

	return (
		<>
			<h1>Video Recommendations</h1>
			{message && <h2 className="message">{message}</h2>}
			<VideoList videos={videos} />
		</>
	);
};

export default App;
