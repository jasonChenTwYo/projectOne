"use client";
import { format } from "date-fns";
import { UserIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Reply } from "@/common/response";
import { addReplyRequestApi, deleteReplyRequestApi } from "@/service/api";
import { useAppSelector } from "@/lib/redux/hook";
export default function Comment({
  id,
  account,
  comment_message,
  comment_time,
  replies: initialReplies,
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
}>) {
  const [replies, setReplies] = useState<Reply[]>(initialReplies ?? []);
  const [replyMessage, setReplyMessage] = useState("");

  const user = useAppSelector((state) => state.userInfo);

  return (
    <div className="bg-gray-50 p-4 mb-2 rounded-lg shadow space-y-2">
      <div className="flex space-x-3 items-start">
        <div className="shrink-0">
          <UserIcon className="w-8 h-8 rounded-full" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">{account}</h4>
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
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            回复
          </button>
        </form>
      )}
      {replies && replies.length > 0 && (
        <div className="mt-2 space-y-2 pl-10">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-white p-3 rounded-lg shadow">
              <div className="flex space-x-3 items-start">
                <div className="shrink-0">
                  <UserIcon className="w-7 h-7 rounded-full" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{reply.account}</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    {reply.comment_message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(reply.comment_time, "yyyy-MM-dd HH:mm:ss")}
                  </p>
                  {user?.account === reply.account && (
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
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
        </div>
      )}
    </div>
  );
}
