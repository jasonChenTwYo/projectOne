"use client";

import { VideoInfo, setInfo } from "@/lib/redux/features/videoInfoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { getVideoInfoApi, records_history } from "@/service/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
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
      records_history(video_id)
        .then(() => {
          console.log("View history recorded");
        })
        .catch((error) => {
          console.error("Failed to record view history:", error);
        });
    }
  }, []);

  return (
    <>
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
          </div>
        </>
      )}
    </>
  );
}
