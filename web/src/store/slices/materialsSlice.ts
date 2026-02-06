import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface RawMaterial {
  id?: number;
  name: string;
  code: string;
  stockQuantity: number;
}

interface MaterialsState {
  list: RawMaterial[];
  status: "idle" | "loading" | "failed";
}

const initialState: MaterialsState = {
  list: [],
  status: "idle",
};

export const fetchMaterials = createAsyncThunk("materials/fetch", async () => {
  const response = await api.get<RawMaterial[]>("/raw-materials");
  return response.data;
});

export const addMaterial = createAsyncThunk(
  "materials/add",
  async (newMaterial: RawMaterial) => {
    const response = await api.post<RawMaterial>("/raw-materials", newMaterial);
    return response.data;
  },
);

export const materialsSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.status = "idle";
        state.list = action.payload;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default materialsSlice.reducer;
