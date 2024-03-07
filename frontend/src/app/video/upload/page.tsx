import UploadVideoForm from "@/app/ui/video/uploadvideoform";
import { Suspense } from "react";

export default async function Page() {
  return (
    <main className="container mx-auto py-20">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Upload a Video
      </h1>
      <Suspense fallback={<Loading />}>
        <UploadVideoForm />
      </Suspense>
    </main>
  );
}
function Loading() {
  return <h2>Loading...</h2>;
}
