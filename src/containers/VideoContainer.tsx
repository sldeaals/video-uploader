import { useState, useEffect } from "react";
import VideoList from "../components/VideoList";
import VideoPlayer from "../components/VideoPlayer";
import { getFileNameWithoutExtension } from "../utils/utils";

interface VideoContainerProps {
  selectedVideoUrl: string | null;
  setSelectedVideoUrl: (url: string | null) => void;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ selectedVideoUrl, setSelectedVideoUrl }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(selectedVideoUrl);
  const fileName = videoUrl ? getFileNameWithoutExtension(videoUrl) : "Uploaded Video";

  useEffect(() => {
    if (selectedVideoUrl) {
      setVideoUrl(selectedVideoUrl);
    }
  }, [selectedVideoUrl]);

  return (
    <div className="video-conntainer">
      <VideoList onSelect={setSelectedVideoUrl} selectedVideo={videoUrl} />
      <VideoPlayer videoUrl={videoUrl} fileName={fileName} />
    </div>
  );
}

export default VideoContainer;
