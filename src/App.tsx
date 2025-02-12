import React, { useState } from "react";
import VideoUpload from "./components/VideoUpload";
import VideoPlayer from "./components/VideoPlayer";
import './App.css'

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Uploader</h1>
      </header>
      <div className="App-body">
        <VideoUpload setVideoUrl={setVideoUrl}/>
        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
      </div>
    </div>
  );
};

export default App;
