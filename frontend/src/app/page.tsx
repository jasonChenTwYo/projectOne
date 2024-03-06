"use client";

import { getHomeVideoApi } from "@/service/api";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { VideoInfo, setInfo } from "@/lib/redux/features/videoInfoSlice";
import { useAppDispatch } from "@/lib/redux/hook";

export default function Page() {
  const [videoList, setvideoList] = useState<VideoInfo[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchVideo = async () => {
      const response = await getHomeVideoApi();
      const list = response.video_list;
      const defaultLength = 10;
      if (list.length < defaultLength) {
        const itemsToAdd = defaultLength - videoList.length;
        for (let i = 0; i < itemsToAdd; i++) {
          list.push({});
        }
      }
      setvideoList(list);
    };

    fetchVideo();
  }, []);

  return (
    <main className="grid grid-cols-4 gap-5 container mx-auto py-20">
      {videoList.map((video, index) => {
        const imagName = video.thumbnail_path ?? "Folder.jpg";
        const groupPath = video.user_id ?? "default";
        const imagPath = `${groupPath}/${imagName}`;
        return (
          // <video
          //   width="100%"
          //   key={video.video_id}
          //   src={`/api/play-video/${video.video_path}?group_id=${video.user_id}`}
          //   controls
          // ></video>
          <Link
            className=" h-auto"
            key={`video_${index}`}
            href={`/video/play?video_id=${video.video_id}`}
            onClick={() => {
              dispatch(setInfo(video));
            }}
          >
            <Image
              src={`/api/img/${imagPath}`}
              width={300}
              height={500}
              alt="Picture of the author"
            />
            <p className="hidden md:block text-base">{video.title}</p>
          </Link>
        );
      })}
    </main>
  );
}
