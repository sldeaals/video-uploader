import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadVideoThunk, fetchVideosThunk } from "../thunks/videoThunks";

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  videoUrl: string | null;
  videos: string[];
  paused: boolean;
  uploadChunk: Blob | null;
}

const initialState: UploadState = {
  uploading: false,
  progress: 0,
  error: null,
  videoUrl: null,
  videos: [],
  paused: false,
  uploadChunk: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    startUpload: (state) => {
      state.uploading = true;
      state.progress = 0;
      state.error = null;
    },
    updateProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    uploadSuccess: (state) => {
      state.uploading = false;
      state.progress = 100;
    },
    uploadFailure: (state, action: PayloadAction<string>) => {
      state.uploading = false;
      state.error = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
      localStorage.setItem("uploadProgress", JSON.stringify(state.progress));
    },
    setUploadPaused: (state, action: PayloadAction<boolean>) => {
      state.paused = action.payload;
    },
    setUploadChunk: (state, action: PayloadAction<Blob | null>) => {
      state.uploadChunk = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(uploadVideoThunk.pending, (state) => {
      state.uploading = true;
      state.error = null;
    })
    .addCase(uploadVideoThunk.fulfilled, (state, action) => {
      state.uploading = false;
      state.progress = 100;
      state.videoUrl = action.payload;
      localStorage.removeItem("uploadProgress");
    })
    .addCase(uploadVideoThunk.rejected, (state, action) => {
      state.uploading = false;
      state.error = action.payload as string;
    })
    .addCase(fetchVideosThunk.fulfilled, (state, action) => {
      state.videos = action.payload;
    });
  }
});

export const { startUpload, updateProgress, uploadSuccess, uploadFailure, setProgress, setUploadPaused, setUploadChunk } = uploadSlice.actions;
export default uploadSlice.reducer;
