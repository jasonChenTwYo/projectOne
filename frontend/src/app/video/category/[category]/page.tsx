import Link from "next/link";
import Image from "next/image";
import { getTagVideoResponse } from "@/service/api";

export default async function Page({
  params,
}: {
  params: { category: string };
}) {
  const response = await getTagVideoResponse(params.category);
  const videoList = response.video_list;

  return (
    <main className="grid grid-cols-4 gap-5 container mx-auto py-20">
      {videoList.map((video) => {
        const imagName = video.thumbnail_path ?? "Folder.jpg";
        const groupPath = video.user_id ?? "default";
        const imagPath = `${groupPath}/${imagName}`;
        return (
          <Link
            className=" h-auto"
            key={`${video.video_id}`}
            href={`/video/play?video_id=${video.video_id}`}
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
