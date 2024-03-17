import { UUID } from "crypto";
import PlayVideo from "@/app/ui/video/playVideo";
import VideoComment from "@/app/ui/video/videocomment";
import { auth } from "@/lib/config/auth.config";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: { video_id: UUID };
}>) {
  const session = await auth();
  return (
    <main className="container mx-auto py-20">
      <PlayVideo {...searchParams} />
      <VideoComment session={session} {...searchParams} />
    </main>
  );
}
