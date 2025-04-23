import { configureStore } from "@reduxjs/toolkit";

import DeviceTypeReducer from "./Slices/DeviceType";

export const store = configureStore({
  reducer: {
    DeviceType: DeviceTypeReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware();
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
