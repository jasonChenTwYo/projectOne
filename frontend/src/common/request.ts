export type AddVideoCommentRequest = {
  video_id: string;
  comment_message: string;
};

export type DeleteVideoCommentRequest = {
  video_comment_id: string;
};

export type AddReplyRequest = {
  comment_id: string;
  comment_message: string;
};

export type DeleteReplyRequest = {
  video_comment_id: string;
  reply_id: string;
};
