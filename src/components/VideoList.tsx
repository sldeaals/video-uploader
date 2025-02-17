import React, { useEffect } from "react";
import { RootState, useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import { fetchVideosThunk } from "../redux/thunks/videoThunks";
import { getFileNameWithoutExtension } from "../utils/utils";

interface VideoListProps {
  onSelect: (url: string) => void;
  selectedVideo: string | null;
}

const VideoList: React.FC<VideoListProps> = ({ onSelect, selectedVideo }) => {
  const dispatch = useAppDispatch();
  const videos = useSelector((state: RootState) => state.upload.videos);

  useEffect(() => {
    dispatch(fetchVideosThunk());
  }, [dispatch]);

  return (
    <div className="video-list">
      <h2>Videos List</h2>
      <ul>
        {videos.map((video, index) => {
          const fileName = getFileNameWithoutExtension(video);
          return (
            <li
              key={index}
              className={video === selectedVideo ? "selected-video" : ""}
              onClick={() => onSelect(video)}
            >
              {fileName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VideoList;
