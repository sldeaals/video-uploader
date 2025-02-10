import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { uploadVideoThunk } from "../redux/thunks/videoThunks";

const VideoUpload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { uploading, progress } = useSelector(
    (state: RootState) => state.video
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      dispatch(uploadVideoThunk(e.target.files[0]));
    }
  };

  return (
    <div>
      <input onChange={handleUpload} type="file" accept="video/*" />
      {uploading && <progress value={progress} max="100"></progress>}
    </div>
  );
};

export default VideoUpload;
