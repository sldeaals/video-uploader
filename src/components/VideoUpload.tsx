import React, { useState } from "react";
import { useAppDispatch, RootState } from "../store/store";
import { useSelector } from "react-redux";
import { uploadVideoThunk } from "../redux/thunks/videoThunks";

const createWorker = () => new Worker(new URL("../workers/uploadWorker.ts", import.meta.url), { type: "module" });

interface VideoUploadProps {
  setVideoUrl?: (url: string | null) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ setVideoUrl }) => {
  const dispatch = useAppDispatch();
  const { progress, uploading, error } = useSelector((state: RootState) => state.upload);

  const [file, setFile] = useState<File | null>(null);
  const [chunkSize] = useState<number>(5 * 1024 * 1024);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const worker = createWorker();
    worker.postMessage({ file, chunkSize });

    worker.onmessage = (e) => {
      const { chunks } = e.data;
      dispatch(uploadVideoThunk({ fileName: file.name, chunks }))/*.unwrap().then((uploadedUrl) => setVideoUrl(uploadedUrl))*/;
      worker.terminate();
    };
  };

  return (
    <div className="video-upload">
      <input type="file" onChange={handleFileChange} accept="video/*" className="file-input" />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="upload-btn"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {uploading && <progress value={progress} max="100" className="progress-bar"></progress>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default VideoUpload;
