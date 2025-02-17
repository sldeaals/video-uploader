import React, { useState } from "react";
import AppView from "../components/AppView";

const AppContainer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  return <AppView videoUrl={videoUrl} setVideoUrl={setVideoUrl} />;
};

export default AppContainer;
