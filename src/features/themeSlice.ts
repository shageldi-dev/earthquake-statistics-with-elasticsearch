import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  mode: "dark" | "light";
}

const localStorageKey = "themePreference";

const savedTheme = localStorage.getItem(localStorageKey);
const initialState: ThemeState = {
  mode: savedTheme === "dark" ? "dark" : "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem(localStorageKey, state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice;
