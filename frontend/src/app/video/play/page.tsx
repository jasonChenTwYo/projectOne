import { UUID } from "crypto";
import PlayVideo from "@/app/ui/video/playVideo";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: { video_id: UUID };
}>) {
  return (
    <main className="container mx-auto py-20">
      <PlayVideo {...searchParams} />
    </main>
  );
}
