import { auth } from "@/lib/config/auth.config";
import { VideoInfo } from "@/lib/redux/features/videoInfoSlice";
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

interface RegisterResponse {
  message: string;
}

interface GetHomeVideoResponse {
  video_list: VideoInfo[];
}

interface GetVideoInfoResponse {
  video_info: VideoInfo;
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
    console.log("response data:", response.data);
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

export const registerApi = async (
  formData: FormData
): Promise<RegisterResponse> => {
  const api = createApiInstance();
  return api
    .post<RegisterResponse>("/api/register", formDataToJson(formData))
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      return { message: "fail" };
    });
};

export const getHomeVideoApi = async (): Promise<GetHomeVideoResponse> => {
  const api = createApiInstance();
  return api
    .get<GetHomeVideoResponse>("/api/home/get-video")
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      return { video_list: [] };
    });
};

export const getVideoInfoApi = async (
  video_id: string
): Promise<GetVideoInfoResponse> => {
  const api = createApiInstance();
  return api
    .get<GetVideoInfoResponse>(`/api/get-video/${video_id}`)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      return { video_info: {} };
    });
};

export const signOutApi = async (): Promise<LogOutResponse> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<LogOutResponse>(
      `${process.env.PROXY_HOST ?? "http://127.0.0.1:8000"}/api/logout`
    )
    .then((res) => res.data)
    .catch((error: AxiosError<{ detail?: string }>) => {
      if (error.response?.data?.detail === "not found") {
        return { message: "logoutSuccess" };
      }
      return { message: "fail" };
    });
};

function formDataToJson(formData: FormData): string {
  const object = Object.fromEntries(formData.entries());
  return JSON.stringify(object);
}
