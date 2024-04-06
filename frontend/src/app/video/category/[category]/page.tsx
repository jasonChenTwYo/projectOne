import { getTagVideoResponse } from "@/service/api";
import Video from "@/app/ui/video/video";

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
        return <Video videoInfo={video} key={`${video.video_id}`} />;
      })}
    </main>
  );
}
