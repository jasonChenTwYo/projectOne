import { Category, VideoInfo } from "@/lib/redux/features/videoInfoSlice";

export type BaseResponse = {
  message: string;
};

export type GetChannelInfoResponse = {
  message: string;
  account: string;
  email: string;
  user_name: string;
};

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

export type GetChannelVideoApiResponse = {
  video_list: VideoInfo[];
};

export type GetTagVideoResponse = {
  video_list: VideoInfo[];
};

export type GetVideoInfoResponse = {
  video_info: VideoInfo;
};

export type CategoryForGetAllCategoryResponse = {
  categories: Category[];
};

export type GetCommentsResponse = {
  comments: Comments[];
  total: number;
};

export type Comments = {
  id: string;
  video_id: string;
  account: string;
  comment_message: string;
  comment_time: Date;
  replies?: Reply[];
};

export type Reply = {
  id: string;
  account: string;
  comment_message: string;
  comment_time: Date;
};
