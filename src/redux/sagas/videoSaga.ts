import { put, takeLatest } from "redux-saga/effects";
import { uploadVideoThunk } from "../thunks/videoThunks";

function* handleUploadSuccess() {
  yield put({ type: "notifications/show", payload: "Upload completed successfully!" });
}

export function* uploadSaga() {
  yield takeLatest(uploadVideoThunk.fulfilled, handleUploadSuccess);
}
