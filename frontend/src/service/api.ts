import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useSession, getSession } from "next-auth/react";
// 定義 API 響應類型
interface ApiResponse<T> {
  data: T;
  // 可以根據需要添加其他屬性
}

// 創建一個函數來生成 Axios 實例
function createApiInstance(
  customHeaders?: Record<string, string>,
  isAuth?: boolean
): AxiosInstance {
  customHeaders = customHeaders ?? { "Content-Type": "application/json" };
  const instance = axios.create({
    // baseURL: "https://your-api-base-url.com",
    // 預設 headers
    headers: {
      ...customHeaders, // 合併自定義 headers
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      if (isAuth) {
        const session = await getSession();
        if (!session?.access_token) {
          console.log("access_token not find");
          throw Error("access_token not find");
        }
        const headers = config.headers ?? {};

        headers["Authorization"] = `Bearer ${session?.access_token}`;

        config.headers = headers;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use((response: AxiosResponse) => {
    // 在這裡可以添加響應後的邏輯
    return response;
  });

  return instance;
}
export const uploadVideoApi = async (
  formData: FormData
): Promise<AxiosResponse> => {
  const api = createApiInstance(
    {
      "Content-Type": "multipart/form-data",
    },
    true
  );
  return api
    .post<AxiosResponse>("/api/upload-video", formData)
    .then((res: AxiosResponse) => res.data);
};
