"use client";
import { VideoInfo } from "@/lib/redux/features/videoInfoSlice";
import { useAppSelector } from "@/lib/redux/hook";
import { getVideoInfoApi } from "@/service/api";

import { UUID } from "crypto";
import { useEffect, useState } from "react";

export default function Page({
  searchParams,
}: Readonly<{
  searchParams: { video_id: UUID };
}>) {
  const [videoInfo, setvideoInfo] = useState<VideoInfo>(
    useAppSelector((state) => state.videoInfo)
  );

  useEffect(() => {
    const fetchAndSetVideoInfo = async () => {
      if (!videoInfo.video_id && searchParams.video_id) {
        try {
          const response = await getVideoInfoApi(searchParams.video_id);
          setvideoInfo({ ...response.video_info });
        } catch (error) {
          console.error("Failed to fetch video info:", error);
        }
      }
    };

    fetchAndSetVideoInfo();
  }, []);

  return (
    <main className="container mx-auto py-20">
      {!videoInfo.video_id && <div>Loading....</div>}
      {videoInfo.video_id && (
        <>
          <p>{videoInfo.title}</p>
          <video
            src={`/api/play-video/${videoInfo.video_path}?group_id=${videoInfo.user_id}`}
            controls
            width="80%"
            poster={`/api/img/${videoInfo.user_id}/${videoInfo.thumbnail_path}`}
          ></video>
          <div className="mt-5">
            {videoInfo.categories?.map((tag) => (
              <button
                key={tag.category_id}
                type="button"
                className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mr-2 hover:bg-blue-200 focus:outline-none"
              >
                {tag.category_name}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
