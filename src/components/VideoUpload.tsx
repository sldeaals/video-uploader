import React from "react";

interface VideoUploadProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  handleClear: () => void;
  handlePause: () => void;
  handleResume: () => void;
  inputKey: React.Key | null | undefined;
  file: File | null;
  uploading: boolean;
  uploadComplete: boolean;
  paused: boolean;
  progress: number;
  error: string | null;
  successMessage: string | null;
}

const VideoUpload: React.FC<VideoUploadProps> = React.memo(({
  handleFileChange,
  handleUpload,
  handleClear,
  handlePause,
  handleResume,
  inputKey,
  file,
  uploading,
  uploadComplete,
  paused,
  progress,
  error,
  successMessage,
}) => {
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

      {uploading && !paused && (
        <button onClick={handlePause} className="pause-btn">Pause</button>
      )}

      {paused && (
        <button onClick={handleResume} className="resume-btn">Resume</button>
      )}

      {file && (
        <button onClick={handleClear} className="clear-btn">
          Clear
        </button>
      )}
      {error && <p className="error-text">{error}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
    </div>
  );
});

export default VideoUpload;
