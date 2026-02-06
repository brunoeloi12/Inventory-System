import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface ProductMaterialItem {
  rawMaterialId: number;
  quantity: number;
}

export interface Product {
  id?: number;
  name: string;
  code: string;
  value: number;
  materials: ProductMaterialItem[];
}

interface ProductsState {
  products: Product[];
  status: "idle" | "loading" | "failed";
}

const initialState: ProductsState = {
  products: [],
  status: "idle",
};

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const response = await api.get<Product[]>("/products");
  return response.data;
});

export const addProduct = createAsyncThunk(
  "products/add",
  async (newProduct: Product) => {
    const response = await api.post<Product>("/products", newProduct);
    return response.data;
  },
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      });
  },
});

export default productsSlice.reducer;
