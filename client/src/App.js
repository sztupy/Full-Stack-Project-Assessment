import { useState, useEffect } from "react";

import VideoList from "./components/VideoList";
import VideoSubmission from "./components/VideoSubmission";
import OrderingSelector from "./components/OrderingSelector";

const VIDEO_LIST = [
	{
		id: 523523,
		title: "Never Gonna Give You Up",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		rating: 23,
	},
	{
		id: 523427,
		title: "The Coding Train",
		url: "https://www.youtube.com/watch?v=HerCR8bw_GE",
		rating: 230,
	},
	{
		id: 82653,
		title: "Mac & Cheese | Basics with Babish",
		url: "https://www.youtube.com/watch?v=FUeyrEN14Rk",
		rating: 2111,
	},
	{
		id: 858566,
		title: "Videos for Cats to Watch - 8 Hour Bird Bonanza",
		url: "https://www.youtube.com/watch?v=xbs7FT7dXYc",
		rating: 11,
	},
	{
		id: 453538,
		title:
			"The Complete London 2012 Opening Ceremony | London 2012 Olympic Games",
		url: "https://www.youtube.com/watch?v=4As0e4de-rI",
		rating: 3211,
	},
	{
		id: 283634,
		title: "Learn Unity - Beginner's Game Development Course",
		url: "https://www.youtube.com/watch?v=gB1F9G0JXOo",
		rating: 211,
	},
	{
		id: 562824,
		title: "Cracking Enigma in 2021 - Computerphile",
		url: "https://www.youtube.com/watch?v=RzWB5jL5RX0",
		rating: 111,
	},
	{
		id: 442452,
		title: "Coding Adventure: Chess AI",
		url: "https://www.youtube.com/watch?v=U4ogK0MIzqk",
		rating: 671,
	},
	{
		id: 536363,
		title: "Coding Adventure: Ant and Slime Simulations",
		url: "https://www.youtube.com/watch?v=X-iSQQgOd1A",
		rating: 76,
	},
	{
		id: 323445,
		title: "Why the Tour de France is so brutal",
		url: "https://www.youtube.com/watch?v=ZacOS8NBK6U",
		rating: 73,
	},
];

const App = () => {
	let [videos, setVideos] = useState([]);
	let [order, setOrder] = useState("id");

	function orderVideos(videos, order, initial) {
		switch (order) {
			case "rating_asc":
				return videos.sort((a, b) => a.rating - b.rating);
			case "rating_desc":
				return videos.sort((a, b) => b.rating - a.rating);
			case "random":
				if (initial) {
					return videos.sort(() => 0.5 - Math.random());
				} else {
					return videos; // this should only sort once when getting from backend, then keep it as-is
				}
			case "id":
				return videos.sort((a, b) => a.id - b.id);
		}
	}

	useEffect(() => {
		setVideos([...orderVideos(VIDEO_LIST, order, true)]);
	}, [setVideos, order]);

	const addVideo = function (title, url) {
		const newVideo = {
			id: Math.max(...videos.map((v) => v.id)) + 1,
			title: title,
			url: url,
			rating: 0,
		};
		VIDEO_LIST.push(newVideo);
		setVideos([...orderVideos(VIDEO_LIST, order)]);
	};

	const updateVideo = function (video, action) {
		const deleteVideo = async (selectedVideo) => {
			VIDEO_LIST.splice(VIDEO_LIST.indexOf(selectedVideo), 1);
			setVideos([...orderVideos(VIDEO_LIST, order)]);
		};

		const voteOnVideo = async (selectedVideo, action) => {
			selectedVideo.rating += action == "up" ? 1 : -1;
			setVideos([...orderVideos(VIDEO_LIST, order)]);
		};

		let selectedVideo = VIDEO_LIST.find((e) => e.id === video.id);

		if (selectedVideo) {
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
			<OrderingSelector order={order} setOrder={setOrder} />
			<VideoList videos={videos} updateVideo={updateVideo} />
			<VideoSubmission addVideo={addVideo} />
		</>
	);
};

export default App;
