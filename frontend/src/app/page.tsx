// import React, { useEffect, useState } from "react";

export default function Page() {
  // useEffect(() => {
  //   // 假設 `fetchVideo` 是一個從API取得影片URL的函式
  //   const fetchVideo = async () => {
  //     // 這裡使用一個假設的API endpoint "/api/video"
  //     const response = await fetch("/api/video");
  //     const data = await response.json();
  //     setVideoUrl(data.url); // 假設API回傳的物件中包含了影片的URL
  //   };

  //   fetchVideo();
  // }, []);

  let videoUrl =
    "/api/play-video/2eaf1b1f-f484-453b-b3a6-eda3bb0a13d4_20240225235647?group_id=1baa5def-5419-451c-85ef-82ef10766dfc";
  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center py-20">
      <video
        src={videoUrl}
        controls
        width="80%"
        // poster="/api/img/Folder.jpg"
      ></video>
    </main>
  );
}
