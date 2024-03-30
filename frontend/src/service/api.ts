import {
  AddReplyRequest,
  AddVideoCommentRequest,
  DeleteReplyRequest,
} from "@/common/request";
import {
  BaseResponse,
  CategoryForGetAllCategoryResponse,
  Comments,
  GetCommentsResponse,
  GetHomeVideoResponse,
  GetTagVideoResponse,
  GetVideoInfoResponse,
  LogOutResponse,
  RegisterResponse,
  UploadVideoApiResponse,
} from "@/common/response";
import { auth } from "@/lib/config/auth.config";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { getSession, signOut } from "next-auth/react";

export interface ApiInstance {
  customHeaders?: Record<string, string>;
  isAuth?: boolean;
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
    (error: Error) => {
      console.log(error.message);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("response data:", response.data);

      return response;
    },
    async (error: AxiosError) => {
      console.log(error.message);
      console.log(error.response?.data);
      await signOut({ callbackUrl: "/login" });
      return Promise.reject(error);
    }
  );

  return instance;
}
export const uploadVideoApi = async (
  formData: FormData
): Promise<UploadVideoApiResponse> => {
  const api = createApiInstance({
    customHeaders: {
      "Content-Type": "multipart/form-data",
    },
    isAuth: true,
  });
  return api
    .post<UploadVideoApiResponse>("/api/upload-video", formData)
    .then((res) => res.data)
    .catch((error: AxiosError<{ detail?: string }>) => {
      if (error.response?.data?.detail === "not found") {
        return { message: "not found" };
      }
      return { message: "fail" };
    });
};

export const records_history = async (
  video_id: string
): Promise<BaseResponse> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<BaseResponse>(`/api/add-history/${video_id}`)
    .then((res) => res.data)
    .catch(() => {
      return { message: "fail" };
    });
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

export const addVideoCommentRequestApi = async (
  addVideoCommentRequest: AddVideoCommentRequest
): Promise<BaseResponse> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<BaseResponse>("/api/add/comment", addVideoCommentRequest)
    .then((res) => res.data)
    .catch(() => {
      return { message: "fail" };
    });
};

export const addReplyRequestApi = async (
  addReplyRequest: AddReplyRequest
): Promise<Comments> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<Comments>("/api/add/reply", addReplyRequest)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("fail");
    });
};

export const deleteReplyRequestApi = async (
  deleteReplyRequest: DeleteReplyRequest
): Promise<Comments> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<Comments>("/api/delete/reply", deleteReplyRequest)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("fail");
    });
};

export const getHomeVideoApi = async (): Promise<GetHomeVideoResponse> => {
  const api = createApiInstance();
  return api
    .get<GetHomeVideoResponse>("/api/home/get-video")
    .then((res) => res.data)
    .catch(() => {
      return { video_list: [] };
    });
};

export const getTagVideoResponse = async (
  category_name: string
): Promise<GetTagVideoResponse> => {
  const api = createApiInstance();
  return api
    .get<GetTagVideoResponse>(
      `${process.env.PROXY_HOST ?? ""}/api/tag/${category_name}`
    )
    .then((res) => res.data)
    .catch(() => {
      return { video_list: [] };
    });
};

export const getVideoCommentsApi = async (
  video_id: string
): Promise<GetCommentsResponse> => {
  const api = createApiInstance();
  return api
    .get<GetCommentsResponse>(`/api/get-video-comment/${video_id}`)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      return { comments: [] };
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

export const getAllCategoryApi =
  async (): Promise<CategoryForGetAllCategoryResponse> => {
    const api = createApiInstance();
    return api
      .get<CategoryForGetAllCategoryResponse>(`/api/get-category/all`)
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        return { categories: [] };
      });
  };

function formDataToJson(formData: FormData): string {
  const object = Object.fromEntries(formData.entries());
  return JSON.stringify(object);
}
