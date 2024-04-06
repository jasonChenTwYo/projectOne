"use client";

import { getHomeVideoApi } from "@/service/api";
import { useEffect, useState } from "react";
import { VideoInfo } from "@/lib/redux/features/videoInfoSlice";
import Video from "@/app/ui/video/video";
export default function Page() {
  const [videoList, setvideoList] = useState<VideoInfo[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await getHomeVideoApi();
      const list = response.video_list;
      setvideoList(list);
    };

    fetchVideo();
  }, []);

  return (
    <main className="grid grid-cols-4 gap-5 container mx-auto py-20">
      {videoList.map((video) => {
        return <Video videoInfo={video} key={`${video.video_id}`} />;
      })}
    </main>
  );
}
