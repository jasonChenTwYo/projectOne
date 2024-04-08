"use client";
import { format } from "date-fns";
import { UserIcon } from "@heroicons/react/24/solid";
import { MouseEventHandler, useState } from "react";
import { Reply } from "@/common/response";
import { addReplyRequestApi, deleteReplyRequestApi } from "@/service/api";
import { useAppSelector } from "@/lib/redux/hook";
import Link from "next/link";

const repliesPerPage = 3;

export default function Comment({
  id,
  account,
  comment_message,
  comment_time,
  replies: initialReplies,
  deleteComment,
}: Readonly<{
  id: string;
  account: string;
  comment_message: string;
  comment_time: Date;
  replies?: {
    id: string;
    account: string;
    comment_message: string;
    comment_time: Date;
  }[];
  deleteComment: MouseEventHandler<HTMLButtonElement>;
}>) {
  const [replies, setReplies] = useState<Reply[]>(initialReplies ?? []);
  const [replyMessage, setReplyMessage] = useState("");
  const totalPages = Math.ceil(replies.length / repliesPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const user = useAppSelector((state) => state.userInfo);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };
  const displayedReplies = replies
    .toSorted(
      (a, b) =>
        new Date(b.comment_time).getTime() - new Date(a.comment_time).getTime()
    )
    .slice((currentPage - 1) * repliesPerPage, currentPage * repliesPerPage);

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

  return (
    <div className="bg-gray-50 p-4 mb-2 rounded-lg shadow space-y-2">
      <div className="flex space-x-3 items-start">
        <div className="shrink-0">
          <UserIcon className="w-8 h-8 rounded-full" />
        </div>
        <div className="flex-1">
          <Link
            className="font-bold text-sm underline"
            href={`/user/${account}`}
          >
            {account}
          </Link>
          <p className="text-gray-700 text-sm mt-1">{comment_message}</p>
          <p className="text-xs text-gray-500">
            {format(comment_time, "yyyy-MM-dd HH:mm:ss")}
          </p>
        </div>
      </div>
      {user?.account && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await addReplyRequestApi({
              comment_id: id,
              comment_message: replyMessage,
            });
            setReplyMessage("");
            setReplies(response.replies ?? replies);
          }}
          className="pl-10 mt-2"
        >
          <input
            type="text"
            className="border rounded-lg p-2 text-sm w-full"
            placeholder="你的回覆..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button
            type="submit"
            className="mr-4 mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            回覆
          </button>
          {user?.account && user?.account === account && (
            <button
              type="button"
              onClick={deleteComment}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              刪除評論
            </button>
          )}
        </form>
      )}
      {replies && replies.length > 0 && (
        <div className="mt-2 space-y-2 pl-10">
          {displayedReplies.map((reply) => (
            <div key={reply.id} className="bg-white p-3 rounded-lg shadow">
              <div className="flex space-x-3 items-start">
                <div className="shrink-0">
                  <UserIcon className="w-7 h-7 rounded-full" />
                </div>
                <div className="flex-1">
                  <Link
                    className="font-bold text-sm underline"
                    href={`/user/${reply.account}`}
                  >
                    {reply.account}
                  </Link>
                  <p className="text-gray-700 text-sm mt-1">
                    {reply.comment_message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(reply.comment_time, "yyyy-MM-dd HH:mm:ss")}
                  </p>
                  {user?.account && user?.account === reply.account && (
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                      onClick={async () => {
                        const response = await deleteReplyRequestApi({
                          video_comment_id: id,
                          reply_id: reply.id,
                        });
                        setReplies(response.replies ?? replies);
                      }}
                    >
                      刪除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="pagination-controls flex justify-center space-x-2 my-4">
            {paginationItems().map((item, index) => (
              <button
                key={`${index}_${item}`}
                disabled={item === currentPage || item === "..."}
                onClick={() => handlePageChange(item)}
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
        </div>
      )}
    </div>
  );
}
