import React from "react";
import VideoUploadContainer from "../containers/VideoUploadContainer";
import VideoContainer from "../containers/VideoContainer";
import "../App.css";

interface AppViewProps {
  videoUrl: string | null;
  setVideoUrl: (url: string | null) => void;
}

const AppView: React.FC<AppViewProps> = React.memo(({ videoUrl, setVideoUrl }) => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Uploader</h1>
      </header>
      <div className="App-body">
        <VideoUploadContainer setVideoUrl={setVideoUrl} />
        <VideoContainer selectedVideoUrl={videoUrl} setSelectedVideoUrl={setVideoUrl} />
      </div>
    </div>
  );
});

export default AppView;
