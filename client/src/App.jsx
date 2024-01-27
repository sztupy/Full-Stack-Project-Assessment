import { useState, useEffect } from "react";

import VideoList from "./components/VideoList";
import VideoSubmission from "./components/VideoSubmission";

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

	const addVideo = function (title, url) {
		const publishToApi = async () => {
			try {
				const results = await fetch("/api/videos", {
					method: "POST",
					body: JSON.stringify({ title: title, url: url }),
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				});
				const data = await results.json();
				if (data.success) {
					setVideos([...videos, data.data]);
				} else {
					setMessage(
						data.message ||
							"Error while publishing the new video. Please reload the page and try again!"
					);
				}
			} catch (error) {
				setMessage(
					"Error while publishing the new video. Please reload the page and try again!"
				);
			}
		};
		publishToApi();
	};

	const deleteVideo = function (video) {
		const deleteVideoAction = async (selectedVideo) => {
			try {
				const results = await fetch(`/api/videos/${selectedVideo.id}`, {
					method: "DELETE",
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				});
				const data = await results.json();
				if (data.success) {
					videos = videos.filter((e) => e.id !== selectedVideo.id);
				} else {
					selectedVideo.message =
						data.message ||
						"There was an error while trying to delete the video. Please reload the page and try again!";
				}
			} catch (error) {
				selectedVideo.message =
					"There was an error while trying to delete the video. Please reload the page and try again!";
			}
			setVideos([...videos]);
		};

		let selectedVideo = videos.find((e) => e.id === video.id);
		if (selectedVideo) {
			deleteVideoAction(selectedVideo);
		}
	};

	return (
		<>
			<h1>Video Recommendations</h1>
			{message && <h2 className="message">{message}</h2>}
			<VideoList videos={videos} deleteVideo={deleteVideo} />
			<VideoSubmission addVideo={addVideo} />
		</>
	);
};

export default App;
