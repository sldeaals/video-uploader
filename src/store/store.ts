import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import videoReducer from "../redux/slices/videoSlice";
import videoSaga from "../redux/sagas/videoSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    video: videoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(videoSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
