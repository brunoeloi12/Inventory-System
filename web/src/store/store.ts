import { configureStore } from "@reduxjs/toolkit";
import materialsReducer from "./slices/materialsSlice";

export const store = configureStore({
  reducer: {
    materials: materialsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
