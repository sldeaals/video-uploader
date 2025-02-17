import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string | null;
  fileName: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = React.memo(({ videoUrl, fileName }) => {
  if (!videoUrl) {
    return null;
  }

  return (
    <div className="video-player">
      <h2>{fileName}</h2>
      <ReactPlayer url={videoUrl} controls width="100%" height="auto" />
    </div>
  );
});

export default VideoPlayer;
