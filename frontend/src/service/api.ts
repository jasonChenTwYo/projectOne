import { auth } from "@/common/config/auth.config";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useSession, getSession } from "next-auth/react";

interface ApiInstance {
  customHeaders?: Record<string, string>;
  isAuth?: boolean;
}

interface LogOutResponse {
  message: string;
}

// 創建一個函數來生成 Axios 實例
function createApiInstance(
  { customHeaders, isAuth }: ApiInstance = {
    customHeaders: { "Content-Type": "application/json" },
    isAuth: false,
  }
): AxiosInstance {
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
        const isServer = typeof window === "undefined";
        const session = isServer ? await auth() : await getSession();
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
  const api = createApiInstance({
    customHeaders: {
      "Content-Type": "multipart/form-data",
    },
    isAuth: true,
  });
  return api
    .post<AxiosResponse>("/api/upload-video", formData)
    .then((res: AxiosResponse) => res.data);
};

export const signOutApi = async (): Promise<LogOutResponse> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<LogOutResponse>(
      `${process.env.PROXY_HOST ?? "http://127.0.0.1:8000"}/api/logout`
    )
    .then((res) => res.data)
    .catch((error: AxiosError<{ detail?: string }>) => {
      console.error("response data:", error.response?.data);
      if (error.response?.data?.detail === "not found") {
        return { message: "logoutSuccess" };
      }
      return { message: "fail" };
    });
};
