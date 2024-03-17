export type AddVideoCommentRequest = {
  video_id: string;
  comment_message: string;
};

export type AddRepliesRequest = {
  comment_id: string;
  comment_message: string;
};
