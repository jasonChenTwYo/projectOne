import { Category, VideoInfo } from "@/lib/redux/features/videoInfoSlice";

export type LogOutResponse = {
  message: string;
};

export type RegisterResponse = {
  message: string;
};

export type UploadVideoApiResponse = {
  message: string;
};

export type GetHomeVideoResponse = {
  video_list: VideoInfo[];
};

export type GetVideoInfoResponse = {
  video_info: VideoInfo;
};

export type CategoryForGetAllCategoryResponse = {
  categories: Category[];
};
