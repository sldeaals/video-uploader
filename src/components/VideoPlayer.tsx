import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const VideoPlayer = () => {
  const { videoUrl } = useSelector((state: RootState) => state.video);

  return videoUrl ? (
    <video width="600" controls>
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : null;
};

export default VideoPlayer;
