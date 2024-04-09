import { createSlice } from "@reduxjs/toolkit";

type InitGLobalProps = {
  data: any;
};

const initialState: InitGLobalProps = {
  data: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload?.data;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
