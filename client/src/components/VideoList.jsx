import Video from "./Video";

export default function VideoList({ videos }) {
	return (
		<ul id="videos">
			{videos.map((video) => (
				<Video key={video.id} video={video} />
			))}
		</ul>
	);
}
