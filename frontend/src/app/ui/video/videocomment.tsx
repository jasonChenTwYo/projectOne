"use client";

import { Comments } from "@/common/response";
import {
  addVideoCommentRequestApi,
  deleteVideoCommentRequestApi,
  getVideoCommentsApi,
} from "@/service/api";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import Comment from "@/app/ui/video/commet";
import { useAppSelector } from "@/lib/redux/hook";
export default function VideoComment({
  video_id,
}: Readonly<{
  video_id: UUID;
}>) {
  const [comments, setComments] = useState<Comments[]>([]);
  const [newComment, setNewComment] = useState("");

  const user = useAppSelector((state) => state.userInfo);

  const fetchComments = async () => {
    try {
      const response = await getVideoCommentsApi(video_id);
      setComments(response.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            {...comment}
            deleteComment={async (e) => {
              e.preventDefault();
              await deleteVideoCommentRequestApi({
                video_comment_id: comment.id,
              });
              await fetchComments();
            }}
          />
        );
      })}
      {user?.access_token && (
        <>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            name="new-comment"
            id="new-comment"
            className="mt-5 block w-full rounded-md border-2 border-gray-400 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
            rows={3}
            placeholder="Add a new comment..."
          />
          <button
            onClick={async () => {
              console.log("Adding new comment:", newComment);
              const result = await addVideoCommentRequestApi({
                comment_message: newComment,
                video_id: video_id,
              });
              if (result.message == "success") {
                setNewComment("");
                await fetchComments();
              }
            }}
            className="mt-2 inline-flex items-center px-4 py-2 bg-indigo-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 disabled:opacity-25 transition"
          >
            Add Comment
          </button>
        </>
      )}
    </>
  );
}
