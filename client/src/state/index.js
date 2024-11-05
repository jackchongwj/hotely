import { createSlice } from "@reduxjs/toolkit";

// Retrieve the initial mode from localStorage or set to 'dark' by default
const initialMode = localStorage.getItem("mode") || "dark";

const initialState = {
  mode: initialMode,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      // Save the mode in localStorage
      localStorage.setItem("mode", state.mode);
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
