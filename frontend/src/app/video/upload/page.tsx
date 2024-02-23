"use client";

import { useRef } from "react";

export default function Page() {
  const actoion_url = "/api/upload-video";
  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为

    const formData = new FormData(formRef.current);

    try {
      const response = await fetch("/api/upload-video", {
        method: "POST",
        headers: {
          // 假设你的访问令牌存储在 localStorage，或者其他方式获取
          Authorization: `Bearer 270e8911-1656-4a44-811d-b2bc6f8125e6`,
          // 其他自定义 headers
        },
        body: formData,
      });

      if (response.ok) {
        console.log("视频上传成功");
        // 处理成功响应
      } else {
        console.error("视频上传失败");
        // 处理错误响应
      }
    } catch (error) {
      console.error("请求错误", error);
      // 处理请求错误
    }
  };
  return (
    <div>
      <main>
        <h1>Upload a Video</h1>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input name="upload_file" type="file" accept="video/*" />
          <button type="submit">Upload</button>
        </form>
      </main>
    </div>
  );
}
