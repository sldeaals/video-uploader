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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [inputKey, setInputKey] =  useState<any>(Date.now());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setSuccessMessage(null);
      setUploadComplete(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const worker = createWorker();
    worker.postMessage({ file, chunkSize });

    worker.onmessage = (e) => {
      const { chunks } = e.data;
      dispatch(uploadVideoThunk({ fileName: file.name, chunks }))
        .unwrap()
        .then((uploadedUrl: string) => {
          setSuccessMessage("Upload successful!");
          setUploadComplete(true);
          if (setVideoUrl) setVideoUrl(uploadedUrl);
        })
        .catch((error) => console.error("Upload failed:", error));
      worker.terminate();
    };
  };

  const handleClear = () => {
    setFile(null);
    setSuccessMessage(null);
    setUploadComplete(false);
    setInputKey(Date.now());
    if (setVideoUrl) setVideoUrl(null);
  };

  return (
    <div className="video-upload">
      <input type="file" onChange={handleFileChange} key={inputKey} accept="video/*" className="file-input" />
      {uploading && <progress value={progress} max="100" className="progress-bar"></progress>}
      <button
        onClick={handleUpload}
        disabled={!file || uploading || uploadComplete}
        className="upload-btn"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {file && (
        <button onClick={handleClear} className="clear-btn">
          Clear
        </button>
      )}
      {error && <p className="error-text">{error}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
    </div>
  );
};

export default VideoUpload;
