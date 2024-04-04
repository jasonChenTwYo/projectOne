"use client";
import { VideoInfo, setInfo } from "@/lib/redux/features/videoInfoSlice";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/lib/redux/hook";

export default function Page() {
  const [records, setRecords] = useState<History[]>([]);
  const dispatch = useAppDispatch();
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
            const imageName = record.thumbnail_path ?? "unavailable.svg";
            const groupPath = record.user_id ?? "";
            const imagePath =
              record.title === "delete"
                ? "unavailable.svg"
                : `${groupPath}/${imageName}`;
            return (
              <div key={record.video_id} className="mb-6">
                <Link
                  href={`/video/play?video_id=${record.video_id}`}
                  onClick={() => {
                    dispatch(setInfo(record));
                  }}
                >
                  <Image
                    src={`/api/img/${imagePath}`}
                    width={300}
                    height={500}
                    className="transition-transform duration-200 ease-in-out transform hover:scale-105"
                    alt="Picture of the author"
                  />
                  <p className="p-4 bg-white text-sm font-medium text-gray-900 truncate">
                    {record.title}
                  </p>
                </Link>
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
