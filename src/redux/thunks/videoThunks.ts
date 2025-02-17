import { createAsyncThunk } from "@reduxjs/toolkit";
import { startUpload, updateProgress, uploadSuccess, uploadFailure, setProgress } from "../slices/videoSlice";
import { RootState } from "../../store/store";

interface Chunk {
  index: number;
  data: Blob;
}

interface UploadPayload {
  fileName: string;
  chunks: Chunk[];
}

export const uploadVideoThunk = createAsyncThunk<string, UploadPayload>(
  "upload/video",
  async ({ fileName, chunks }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startUpload());

    try {
      let state = getState() as RootState;
      let startIndex = Math.floor(state.upload.progress / 100 * chunks.length);

      for (let i = startIndex; i < chunks.length; i++) {
        state = getState() as RootState;

        if (state.upload.paused) {
          break;
        }

        const formData = new FormData();
        formData.append("file", chunks[i].data);
        formData.append("fileName", fileName);
        formData.append("index", chunks[i].index.toString());

        await fetch(`${process.env.REACT_APP_API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const progress = ((i + 1) / chunks.length) * 100;
        dispatch(updateProgress(progress));
        dispatch(setProgress(progress));
      }

      state = getState() as RootState;
      if (!state.upload.paused) {
        const mergeResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/merge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, totalChunks: chunks.length }),
        });

        if (!mergeResponse.ok) {
          throw new Error("Merge failed");
        }

        const responseData = await mergeResponse.json();
        const uploadedUrl = responseData.url;

        dispatch(uploadSuccess());
        return uploadedUrl;
      }

      return rejectWithValue("Upload paused");
    } catch (error) {
      dispatch(uploadFailure("Upload failed"));
      return rejectWithValue("Upload failed");
    }
  }
);

export const fetchVideosThunk = createAsyncThunk<string[]>(
  "videos/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/videos`);
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue("Failed to fetch videos");
    }
  }
);
