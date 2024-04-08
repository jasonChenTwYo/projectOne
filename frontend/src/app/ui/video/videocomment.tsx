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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useAppSelector((state) => state.userInfo);

  const fetchComments: () => Promise<void> = async function () {
    try {
      const response = await getVideoCommentsApi(video_id, currentPage);
      setComments(response.comments);
      // 向上取 列如 10/3 = 3.3333 取4
      setTotalPages(Math.ceil(response.total / 3));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const paginationItems = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let minPage = Math.max(currentPage - 2, 2);
      let maxPage = Math.min(currentPage + 2, totalPages - 1);

      if (minPage !== 2) pageNumbers.push("...");
      for (let i = minPage; i <= maxPage; i++) {
        pageNumbers.push(i);
      }
      if (maxPage !== totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const handlePageSelect = (pageNumber: string | number) => {
    if (pageNumber !== "...") {
      setCurrentPage(Number(pageNumber));
    }
  };

  return (
    <>
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            {...comment}
            deleteComment={async () => {
              await deleteVideoCommentRequestApi({
                video_comment_id: comment.id,
              });
              await fetchComments();
            }}
          />
        );
      })}
      <div className="pagination-controls flex justify-center space-x-2 my-4">
        {paginationItems().map((item, index) => (
          <button
            key={`${index}_${item}`}
            disabled={item === currentPage || item === "..."}
            onClick={() => handlePageSelect(item)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              item === currentPage
                ? "bg-blue-500 text-white"
                : "text-blue-500 bg-white hover:bg-blue-100"
            } ${item === "..." ? "bg-gray-300" : ""}`}
          >
            {item}
          </button>
        ))}
      </div>
      {user?.access_token && (
        <>
          <textarea
            data-cy="add-comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            name="new-comment"
            id="new-comment"
            className="mt-5 block w-full rounded-md border-2 border-gray-400 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
            rows={3}
            placeholder="Add a new comment..."
          />
          <button
            data-cy="add-comment-button"
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
