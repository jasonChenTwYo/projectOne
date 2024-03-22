import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserInfo = {
  account?: string;
  access_token?: string;
};

const initialState: UserInfo = {};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => ({
      ...action.payload,
    }),
  },
});

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
