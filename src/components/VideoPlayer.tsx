import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = React.memo(({ videoUrl }) => {
  if (!videoUrl) {
    return null;
  }

  return (
    <div className="video-player">
      <h2>Uploaded Video</h2>
      <ReactPlayer url={videoUrl} controls width="100%" height="auto" />
    </div>
  );
});

export default VideoPlayer;
