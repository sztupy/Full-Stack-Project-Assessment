import Video from "./Video";

export default function VideoList({ videos, deleteVideo }) {
	return (
		<ul id="videos">
			{videos.map((video) => (
				<Video key={video.id} video={video} deleteVideo={deleteVideo} />
			))}
		</ul>
	);
}
