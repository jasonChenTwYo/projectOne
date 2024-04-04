"use client";

import { VideoInfo, setInfo } from "@/lib/redux/features/videoInfoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { getVideoInfoApi, recordsHistoryApi } from "@/service/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { format } from "date-fns";
import VideoComment from "./videocomment";
export default function PlayVideo({ video_id }: { video_id: UUID }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [videoInfo, setvideoInfo] = useState<VideoInfo>(
    useAppSelector((state) => state.videoInfo)
  );
  const user = useAppSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchAndSetVideoInfo = async () => {
      if (!videoInfo.video_id || videoInfo.video_id !== video_id) {
        console.log("fetch video info");
        try {
          const response = await getVideoInfoApi(video_id);
          setvideoInfo({ ...response.video_info });
          dispatch(setInfo({ ...response.video_info }));
        } catch (error) {
          console.error("Failed to fetch video info:", error);
        }
      }
    };

    fetchAndSetVideoInfo();

    if (user.account) {
      recordsHistoryApi(video_id)
        .then(() => {
          console.log("View history recorded");
        })
        .catch((error) => {
          console.error("Failed to record view history:", error);
        });
    }
  }, []);

  const imageName = videoInfo.thumbnail_path ?? "unavailable.svg";
  const groupPath = videoInfo.user_id ?? "";
  const imagePath =
    videoInfo.title === "delete"
      ? `/api/img/unavailable.svg`
      : `/api/img/${groupPath}/${imageName}`;
  const video_path =
    videoInfo.title === "delete"
      ? ""
      : `/api/play-video/${videoInfo.video_path}?group_id=${videoInfo.user_id}`;
  return (
    <>
      {!videoInfo.video_id && <div>Loading....</div>}
      {videoInfo.video_id && (
        <>
          <p>{videoInfo.title}</p>
          <video
            src={video_path}
            controls
            width="80%"
            poster={imagePath}
          ></video>
          <div className="mt-5">
            {videoInfo.categories?.map((tag) => (
              <button
                key={tag.category_name}
                type="button"
                className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mr-2 hover:bg-blue-200 focus:outline-none"
                onClick={() => {
                  router.push(`/video/category/${tag.category_name}`);
                }}
              >
                {tag.category_name}
              </button>
            ))}
            <p className="text-xs text-gray-500">
              {format(
                videoInfo.upload_time ?? new Date(),
                "yyyy-MM-dd HH:mm:ss"
              )}
            </p>
          </div>
        </>
      )}

      {videoInfo.title !== "delete" && <VideoComment video_id={video_id} />}
    </>
  );
}
