import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import { uploadVideoThunk } from "../redux/thunks/videoThunks";
import VideoUpload from "../components/VideoUpload";

interface VideoUploadContainerProps {
  setVideoUrl?: (url: string | null) => void;
}

const VideoUploadContainer: React.FC<VideoUploadContainerProps> = ({ setVideoUrl }) => {
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
    if (!file) {
      return;
    }

    const fileChunks: { index: number; data: Blob }[] = [];
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      fileChunks.push({ index: i, data: file.slice(start, end) });
    }
    
    dispatch(uploadVideoThunk({ fileName: file.name, chunks: fileChunks }))
      .unwrap()
      .then((uploadedUrl: string) => {
        setSuccessMessage("Upload successful!");
        setUploadComplete(true);
        if (setVideoUrl) setVideoUrl(uploadedUrl);
      })
      .catch((error) => console.error("Upload failed:", error));
  }

  const handleClear  = () => {
    setFile(null);
    setSuccessMessage(null);
    setUploadComplete(false);
    setInputKey(Date.now());
    if (setVideoUrl) {
      setVideoUrl(null);
    }
  };

  return (
    <VideoUpload
      handleFileChange={handleFileChange}
      handleUpload={handleUpload}
      handleClear={handleClear}
      inputKey={inputKey}
      file={file}
      uploading={uploading}
      uploadComplete={uploadComplete}
      progress={progress}
      error={error}
      successMessage={successMessage}
    />
  );
}

export default VideoUploadContainer;
