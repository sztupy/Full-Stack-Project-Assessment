import { useState, useEffect } from "react";

import VideoList from "./components/VideoList";
import VideoSubmission from "./components/VideoSubmission";
import OrderingSelector from "./components/OrderingSelector";

const App = () => {
	let [videos, setVideos] = useState([]);
	let [message, setMessage] = useState(null);
	let [order, setOrder] = useState("id");

	function orderVideos(videos, order) {
		switch (order) {
			case "rating_asc":
				return videos.sort((a, b) => a.rating - b.rating);
			case "rating_desc":
				return videos.sort((a, b) => b.rating - a.rating);
			case "random":
				return videos; // this should only sort once when getting from backend, then keep it as-is
			case "id":
				return videos.sort((a, b) => a.id - b.id);
		}
	}

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const videoResults = await fetch(`/api/videos?order=${order}`);
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
	}, [setVideos, setMessage, order]);

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
					setVideos(orderVideos([...videos, data.data], order));
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

	const updateVideo = function (video, action) {
		const deleteVideo = async (selectedVideo) => {
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
			setVideos(orderVideos([...videos], order));
		};

		const voteOnVideo = async (selectedVideo, action) => {
			try {
				const results = await fetch(
					`/api/videos/${selectedVideo.id}/${action}`,
					{
						method: "POST",
						headers: {
							"Access-Control-Allow-Origin": "*",
						},
					}
				);
				const data = await results.json();
				if (data.success) {
					selectedVideo.rating = data.data.rating;
					selectedVideo.message = null;
				} else {
					selectedVideo.message =
						data.message ||
						"There was an error while updating rating to the video. Please reload the page and try again!";
				}
			} catch (error) {
				selectedVideo.message =
					"There was an error while updating rating to the video. Please reload the page and try again!";
			}
			setVideos(orderVideos([...videos], order));
		};

		let selectedVideo = videos.find((e) => e.id === video.id);

		if (selectedVideo) {
			selectedVideo.message = " ";
			setVideos(orderVideos([...videos], order));

			switch (action) {
				case "up":
				case "down":
					voteOnVideo(selectedVideo, action);
					break;
				case "delete":
					deleteVideo(selectedVideo);
					break;
			}
		}
	};

	return (
		<>
			<h1>Video Recommendations</h1>
			{message && <h2 className="message">{message}</h2>}
			<OrderingSelector order={order} setOrder={setOrder} />
			<VideoList videos={videos} updateVideo={updateVideo} />
			<VideoSubmission addVideo={addVideo} />
		</>
	);
};

export default App;
