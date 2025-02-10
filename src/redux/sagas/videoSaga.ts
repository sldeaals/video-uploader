import { put, takeLatest } from "redux-saga/effects";
import { uploadStart, uploadSuccess, uploadFail } from "../slices/videoSlice";

function* uploadVideoSaga(action: any) {
  try {
    yield put(uploadStart());
    const response: Response = yield fetch("/api/upload", {
      method: "POST",
      body: action.payload,
    });
    const data: { videoUrl: string } = yield response.json();
    yield put(uploadSuccess(data.videoUrl));
  } catch (error) {
    yield put(uploadFail);
  }
}

export function* watchVideoUpload() {
  yield takeLatest("video/uploadStart", uploadVideoSaga);
}

export default function* videoSaga() {
  yield watchVideoUpload();
}
