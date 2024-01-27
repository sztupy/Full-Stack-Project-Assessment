// source: https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function youtubeLinkParser(url) {
	let regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	let match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}

export default function Video({ video, deleteVideo }) {
	const youtubeId = youtubeLinkParser(video.url);

	return (
		<li className="video">
			<h2>
				<a href={video.url} tabIndex={0}>
					{video.title}
				</a>
			</h2>
			{youtubeId && (
				<iframe
					src={`https://www.youtube.com/embed/${youtubeId}`}
					title={video.title}
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			)}
			<h3>Controls</h3>
			<div className="control-message">{video.message}</div>
			<div className="controls">
				<button onClick={() => deleteVideo(video)}>Remove video</button>
			</div>
		</li>
	);
}
