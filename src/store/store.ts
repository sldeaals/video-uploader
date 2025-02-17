import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import uploadReducer, { uploadSuccess } from "../redux/slices/videoSlice";
import { uploadSaga } from "../redux/sagas/videoSaga";
import { useDispatch } from "react-redux";
import { fetchVideosThunk } from "../redux/thunks/videoThunks";

const sagaMiddleware = createSagaMiddleware();
const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(uploadSuccess),
  effect: async (_, { dispatch }) => {
    await dispatch(fetchVideosThunk());
  },
});

export const store = configureStore({
  reducer: { upload: uploadReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(sagaMiddleware),
});

sagaMiddleware.run(uploadSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
