"use client";
import Link from "next/link";
import Image from "next/image";
import { VideoInfo, setInfo } from "@/lib/redux/features/videoInfoSlice";
import { useAppDispatch } from "@/lib/redux/hook";
export default function ({ videoInfo }: { videoInfo: VideoInfo }) {
  const dispatch = useAppDispatch();
  const imageName = videoInfo.thumbnail_path ?? "unavailable.svg";
  const groupPath = videoInfo.user_id ?? "";
  const imagePath =
    videoInfo.title === "delete"
      ? "unavailable.svg"
      : `${groupPath}/${imageName}`;

  return (
    <Link
      data-cy={`link-${videoInfo.video_id}`}
      className="h-auto"
      href={`/video/play?video_id=${videoInfo.video_id}`}
      onClick={() => {
        dispatch(setInfo(videoInfo));
      }}
    >
      <Image
        src={`/api/img/${imagePath}`}
        width={300}
        height={500}
        alt="Picture of the author"
      />
      <p className="hidden md:block text-base">{videoInfo.title}</p>
    </Link>
  );
}
