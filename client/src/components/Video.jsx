export default function Video({ video }) {
	return (
		<li className="video">
			<a href={video.url} tabIndex={0}>
				{video.title}
			</a>
		</li>
	);
}
