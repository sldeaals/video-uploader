import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer: React.FC<{ videoUrl: string | null }> = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <div className="video-player">
      <h2>Uploaded Video</h2>
      <ReactPlayer url={videoUrl} controls width="100%" height="auto" />
    </div>
  );
};

export default VideoPlayer;
