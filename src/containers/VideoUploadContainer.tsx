import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import { uploadVideoThunk } from "../redux/thunks/videoThunks";
import VideoUpload from "../components/VideoUpload";
import { setProgress, setUploadPaused } from "../redux/slices/videoSlice";
import { CHUNK_SIZE } from "../constants/constants";

interface VideoUploadContainerProps {
  setVideoUrl?: (url: string | null) => void;
}

const VideoUploadContainer: React.FC<VideoUploadContainerProps> = ({ setVideoUrl }) => {
  const dispatch = useAppDispatch();
  const { progress, uploading, error, paused } = useSelector((state: RootState) => state.upload);

  const [file, setFile] = useState<File | null>(null);
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
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
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

  const  handlePause = () => {
    dispatch(setUploadPaused(true));
  }

  const handleResume = () => {
    dispatch(setUploadPaused(false));
    handleUpload();
  }

  const handleClear  = () => {
    setFile(null);
    setSuccessMessage(null);
    setUploadComplete(false);
    setInputKey(Date.now());

    dispatch(setProgress(0));
    dispatch(setUploadPaused(false));

    if (setVideoUrl) {
      setVideoUrl(null);
    }
  };

  return (
    <VideoUpload
      handleFileChange={handleFileChange}
      handleUpload={handleUpload}
      handlePause={handlePause}
      handleResume={handleResume}
      handleClear={handleClear}
      inputKey={inputKey}
      file={file}
      uploading={uploading}
      uploadComplete={uploadComplete}
      paused={paused}
      progress={progress}
      error={error}
      successMessage={successMessage}
    />
  );
}

export default VideoUploadContainer;
