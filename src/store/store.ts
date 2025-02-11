import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import uploadReducer from "../redux/slices/videoSlice";
import { uploadSaga } from "../redux/sagas/videoSaga";
import { useDispatch } from "react-redux";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: { upload: uploadReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(uploadSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
