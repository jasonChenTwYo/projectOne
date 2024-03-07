import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type VideoInfo = {
  title?: string;
  video_id?: string;
  video_path?: string;
  user_id?: string;
  user_name?: string;
  description?: string;
  thumbnail_path?: string;
  categories?: Category[];
};

export type Category = {
  category_name?: string;
  category_id?: string;
};

const initialState: VideoInfo = {};

const videoInSlice = createSlice({
  name: "videoInfo",
  initialState: initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<VideoInfo>) => ({
      ...action.payload,
    }),
  },
});

export const { setInfo } = videoInSlice.actions;
export default videoInSlice.reducer;
