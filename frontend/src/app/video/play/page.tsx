import { UUID } from "crypto";
import PlayVideo from "@/app/ui/video/playVideo";
import VideoComment from "@/app/ui/video/videocomment";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: { video_id: UUID };
}>) {
  return (
    <main className="container mx-auto py-20">
      <PlayVideo {...searchParams} />
      <VideoComment {...searchParams} />
    </main>
  );
}
