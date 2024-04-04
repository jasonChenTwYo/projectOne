import Link from "next/link";
import Image from "next/image";
import { getTagVideoResponse } from "@/service/api";

export default async function Page({
  params,
}: Readonly<{
  params: { category: string };
}>) {
  const response = await getTagVideoResponse(params.category);
  const videoList = response.video_list;

  return (
    <main className="grid grid-cols-4 gap-5 container mx-auto py-20">
      {videoList.map((video) => {
        const imageName = video.thumbnail_path ?? "unavailable.svg";
        const groupPath = video.user_id ?? "";
        const imagePath =
          video.title === "delete"
            ? "unavailable.svg"
            : `${groupPath}/${imageName}`;
        return (
          <Link
            className=" h-auto"
            key={`${video.video_id}`}
            href={`/video/play?video_id=${video.video_id}`}
          >
            <Image
              src={`/api/img/${imagePath}`}
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
