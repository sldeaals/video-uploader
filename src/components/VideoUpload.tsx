import React, { useState } from "react";
import { useAppDispatch, RootState } from "../store/store";
import { useSelector } from "react-redux";
import { uploadVideoThunk } from "../redux/thunks/videoThunks";

const createWorker = () => new Worker(new URL("../workers/uploadWorker.ts", import.meta.url), { type: "module" });

const VideoUpload: React.FC = () => {
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
      dispatch(uploadVideoThunk({ fileName: file.name, chunks }));
      worker.terminate();
    };
  };

  return (
    <div className="p-4 border rounded w-full max-w-lg mx-auto">
      <input type="file" onChange={handleFileChange} accept="video/*" className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {uploading && <progress value={progress} max="100" className="w-full mt-2"></progress>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default VideoUpload;
