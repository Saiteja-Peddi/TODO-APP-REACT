import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: "",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.username;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = "";
      state.error = action.payload.error;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = "";
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
