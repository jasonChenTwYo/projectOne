import {
  AddReplyRequest,
  AddVideoCommentRequest,
  DeleteReplyRequest,
  DeleteVideoCommentRequest,
} from "@/common/request";
import {
  BaseResponse,
  CategoryForGetAllCategoryResponse,
  Comments,
  GetChannelInfoResponse,
  GetChannelVideoApiResponse,
  GetCommentsResponse,
  GetHomeVideoResponse,
  GetTagVideoResponse,
  GetVideoInfoResponse,
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
      if (
        error.message === "Request failed with status code 404" &&
        JSON.stringify(error.response?.data) ===
          JSON.stringify({ detail: "token not found" })
      ) {
        await signOut({ callbackUrl: "/login" });
      }
      if (error.message === "access_token not find") {
        await signOut({ callbackUrl: "/login" });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
export const uploadVideoApi = (
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

export const getChannelInfoApi = (
  account: string
): Promise<GetChannelInfoResponse> => {
  const api = createApiInstance();
  return api
    .get<GetChannelInfoResponse>(
      `${
        process.env.PROXY_HOST
          ? `${process.env.PROXY_HOST}/api`
          : "http://127.0.0.1:8000"
      }/userInfo?account=${account}`
    )
    .then((res) => res.data);
};

export const getChannelVideoApi = function (
  account: string
): Promise<GetChannelVideoApiResponse> {
  const api = createApiInstance();
  return api
    .get<GetChannelVideoApiResponse>(
      `${
        process.env.PROXY_HOST
          ? `${process.env.PROXY_HOST}/api`
          : "http://127.0.0.1:8000"
      }/get-video/channel/${account}`
    )
    .then((res) => res.data);
};

export const deleteChannelVideoApi = (
  video_id: string
): Promise<BaseResponse> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<BaseResponse>(
      `${
        process.env.PROXY_HOST
          ? `${process.env.PROXY_HOST}/api`
          : "http://127.0.0.1:8000"
      }/delete/video`,
      { video_id: video_id }
    )
    .then((res) => res.data);
};

export const recordsHistoryApi = (video_id: string): Promise<BaseResponse> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<BaseResponse>(`/api/add-history/${video_id}`)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return { message: "fail" };
    });
};

export const registerApi = (formData: FormData): Promise<RegisterResponse> => {
  const api = createApiInstance();
  return api
    .post<RegisterResponse>("/api/register", formDataToJson(formData))
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      return { message: "fail" };
    });
};

export const addVideoCommentRequestApi = (
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

export const deleteVideoCommentRequestApi = (
  deleteVideoCommentRequest: DeleteVideoCommentRequest
): Promise<BaseResponse> => {
  const api = createApiInstance({ isAuth: true });
  return api
    .post<BaseResponse>("/api/delete/comment", deleteVideoCommentRequest)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("fail");
    });
};

export const addReplyRequestApi = (
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

export const deleteReplyRequestApi = (
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

export const getHomeVideoApi = (): Promise<GetHomeVideoResponse> => {
  const api = createApiInstance();
  return api
    .get<GetHomeVideoResponse>("/api/home/get-video")
    .then((res) => res.data)
    .catch(() => {
      return { video_list: [] };
    });
};

export const getTagVideoResponse = (
  category_name: string
): Promise<GetTagVideoResponse> => {
  const api = createApiInstance();
  return api
    .get<GetTagVideoResponse>(
      `${
        process.env.PROXY_HOST
          ? `${process.env.PROXY_HOST}/api`
          : "http://127.0.0.1:8000"
      }/tag/${category_name}`
    )
    .then((res) => res.data)
    .catch(() => {
      return { video_list: [] };
    });
};

export const getVideoCommentsApi = (
  video_id: string,
  page: number
): Promise<GetCommentsResponse> => {
  const api = createApiInstance();
  return api
    .get<GetCommentsResponse>(`/api/get-video-comment/${video_id}?page=${page}`)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      return { comments: [], total: 0 };
    });
};

export const getVideoInfoApi = (
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
  (): Promise<CategoryForGetAllCategoryResponse> => {
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
