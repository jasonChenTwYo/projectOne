"use client";
import { VideoInfo } from "@/lib/redux/features/videoInfoSlice";
import { getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import Video from "@/app/ui/video/video";

export default function Page() {
  const [records, setRecords] = useState<History[]>([]);
  const [offset, setOffset] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  type History = VideoInfo & {
    watch_time: Date;
  };

  async function fetchRecords(
    offset: number
  ): Promise<{ video_list: History[]; message: string }> {
    const session = await getSession();

    if (!session?.access_token) {
      console.log("access_token not find");
      throw Error("access_token not find");
    }
    const response = await fetch(`/api/history/${offset}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const loadRecords = async () => {
      if (!hasMore) return;
      const newRecords = await fetchRecords(offset);
      if (newRecords.video_list.length === 0) {
        setHasMore(false);
      } else {
        setRecords((prevRecords) => [...prevRecords, ...newRecords.video_list]);
        setOffset((prevOffset) => prevOffset + 1);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadRecords();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, offset]);

  const recordsByDate: { [key: string]: History[] } = records.reduce<{
    [key: string]: History[];
  }>((acc, record) => {
    const date = new Date(record.watch_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  return (
    <main className="flex flex-col items-center justify-center space-y-8">
      {Object.entries(recordsByDate).map(([date, records]) => (
        <div key={date} className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{date}</h2>
          {records.map((record) => {
            return (
              <div key={record.video_id} className="mb-6">
                <Video videoInfo={record} />
              </div>
            );
          })}
        </div>
      ))}
      <div className="mt-8">
        {hasMore ? (
          <div ref={loaderRef} className="text-center text-sm text-gray-500">
            Loading more...
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            You have reached the end.
          </div>
        )}
      </div>
    </main>
  );
}
