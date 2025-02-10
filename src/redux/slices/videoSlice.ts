import { createSlice } from "@reduxjs/toolkit";

interface VideoState {
  uploading: boolean;
  progress: number;
  videoUrl: string | null;
  errorMessage: string | null;
}

const initialState: VideoState = {
  uploading: false,
  progress: 0,
  videoUrl: null,
  errorMessage: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    uploadStart(state) {
      state.uploading = true;
      state.progress = 0;
    },
    uploadProgress(state, action) {
      state.progress = action.payload;
    },
    uploadSuccess(state, action) {
      state.uploading = false;
      state.videoUrl = action.payload;
    },
    uploadFail(state, action) {
      state.uploading = false;
      state.errorMessage = action.payload.errorMessage;
    },
  },
});

export const { uploadStart, uploadProgress, uploadSuccess, uploadFail } = videoSlice.actions;

export default videoSlice.reducer;
