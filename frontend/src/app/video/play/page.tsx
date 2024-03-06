"use client";
import { VideoInfo } from "@/lib/redux/features/videoInfoSlice";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hook";
import { getVideoInfoApi } from "@/service/api";
// import React, { useEffect, useState } from "react";

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
  const [videoUrl, setvideoUrl] = useState<string>(
    `/api/play-video/${videoInfo.video_path}?group_id=${videoInfo.user_id}`
  );
  const [poster, setposter] = useState<string>(
    `/api/img/${videoInfo.user_id}/${videoInfo.thumbnail_path}`
  );

  useEffect(() => {
    const fetchAndSetVideoInfo = async () => {
      if (!videoInfo.video_id && searchParams.video_id) {
        try {
          // 这里替换为你的 API 调用
          const response = await getVideoInfoApi(searchParams.video_id);
          setvideoInfo({ ...response.video_info });
          setvideoUrl(
            `/api/play-video/${response.video_info.video_path}?group_id=${response.video_info.user_id}`
          );
          setposter(
            `/api/img/${response.video_info.user_id}/${response.video_info.thumbnail_path}`
          );
        } catch (error) {
          console.error("Failed to fetch video info:", error);
        }
      }
    };

    fetchAndSetVideoInfo();
  }, []);

  return (
    <main className="container mx-auto py-20">
      <p>{videoInfo.title}</p>
      <video src={videoUrl} controls width="80%" poster={poster}></video>
    </main>
  );
}
