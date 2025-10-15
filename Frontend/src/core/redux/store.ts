import { configureStore } from "@reduxjs/toolkit";
import appSettingsReducer from "./app-settings-slice";

export const store = configureStore({
  reducer: {
    appSettings: appSettingsReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
