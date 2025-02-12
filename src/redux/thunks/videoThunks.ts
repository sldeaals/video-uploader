import { createAsyncThunk } from "@reduxjs/toolkit";
import { startUpload, updateProgress, uploadSuccess, uploadFailure } from "../slices/videoSlice";

interface Chunk {
  index: number;
  data: Blob;
}

interface UploadPayload {
  fileName: string;
  chunks: Chunk[];
}

export const uploadVideoThunk = createAsyncThunk<void, UploadPayload>(
  "upload/video",
  async ({ fileName, chunks }, { dispatch }) => {
    dispatch(startUpload());

    try {
      for (let i = 0; i < chunks.length; i++) {
        const formData = new FormData();
        formData.append("file", chunks[i].data);
        formData.append("fileName", fileName);
        formData.append("index", chunks[i].index.toString());

        await fetch("http://localhost:3001/api/upload", {
          method: "POST",
          body: formData,
        });

        dispatch(updateProgress(((i + 1) / chunks.length) * 100));
      }

      const mergeResponse = await fetch("http://localhost:3001/api/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, totalChunks: chunks.length }),
      });

      if (!mergeResponse.ok) {
        throw new Error("Merge failed");
      }

      dispatch(uploadSuccess());
    } catch (error) {
      dispatch(uploadFailure("Upload failed"));
    }
  }
);
