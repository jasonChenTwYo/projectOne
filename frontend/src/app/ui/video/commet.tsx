import { format } from "date-fns";

export default function Comment({
  account,
  comment_message,
  comment_time,
  replies,
}: Readonly<{
  account: string;
  comment_message: string;
  comment_time: Date;
  replies?: { id: string; account: string; comment_message: string }[];
}>) {
  const formattedDate = format(comment_time, "yyyy-MM-dd HH:mm:ss");
  return (
    <div className="mb-4">
      <div className="comment p-4 mb-2 shadow-lg">
        <h4 className="font-bold">{account}</h4>
        <p className="text-gray-600">{comment_message}</p>
        <p className="text-gray-600">{formattedDate}</p>
      </div>
      {replies && replies.length > 0 && (
        <div className="pl-4 mt-2">
          {replies.map((reply) => (
            <div key={reply.id} className="comment p-4 mb-2 shadow-lg">
              <h4 className="font-bold">{reply.account}</h4>
              <p className="text-gray-600">{reply.comment_message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
