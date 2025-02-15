import React from "react";
import VideoUploadContainer from "../containers/VideoUpload";
import VideoPlayer from "./VideoPlayer";
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
        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
      </div>
    </div>
  );
});

export default AppView;
