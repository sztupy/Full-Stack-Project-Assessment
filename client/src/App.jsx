import { useState, useEffect } from "react";

import VideoList from "./components/VideoList";

const App = () => {
	let [videos, setVideos] = useState([]);

	useEffect(() => {
		const fetchVideos = async () => {
			const videoResults = await fetch(`/api/videos`);
			const videoResultsJson = await videoResults.json();
			setVideos(videoResultsJson);
		};
		fetchVideos();
	}, [setVideos]);

	return (
		<>
			<h1>Video Recommendations</h1>
			<VideoList videos={videos} />
		</>
	);
};

export default App;
