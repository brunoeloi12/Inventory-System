import { configureStore } from "@reduxjs/toolkit";
import materialsReducer from "./slices/materialsSlice";
import productsReducer from "./slices/productsSlice";

export const store = configureStore({
  reducer: {
    materials: materialsReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
