import { AppDispatch } from "../../store/store";
import { uploadStart, uploadSuccess, uploadFail } from "../slices/videoSlice";

export const uploadVideoThunk =
  (file: File) => async (dispatch: AppDispatch) => {
    dispatch(uploadStart());

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(uploadSuccess(data.videoUrl));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      dispatch(uploadFail(errorMessage));
    }
  };
