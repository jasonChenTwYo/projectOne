import { VideoInfo } from "@/lib/redux/features/videoInfoSlice";

export type LogOutResponse = {
  message: string;
};

export type RegisterResponse = {
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

export type Category = {
  category_name: string;
  category_id: string;
};
