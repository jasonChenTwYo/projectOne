import { z } from "zod";
import { uploadVideoApi } from "@/service/api";

import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
//import { signIn } from "@/app/api/auth/[...nextauth]/route";
// import { signIn } from "@/common/config/auth.config";
const uploadVideoSchema = z.object({
  title: z.string({
    invalid_type_error: "Invalid title",
  }),
});

export type State = {
  errors?: {};
  message?: string;
};

export async function uploadVideo(prevState: State, formData: FormData) {
  const validatedFields = uploadVideoSchema.safeParse({
    title: formData.get("title"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Mutate data

  try {
    const response = await uploadVideoApi(formData);
    if (response.status === 200) {
      console.log("影片上傳成功");
      return { message: "影片上傳成功" };
    } else {
      console.error("影片上傳失敗");
      return { message: "影片上傳失敗" };
    }
  } catch (error) {
    console.error("請求錯誤", error);
    return { message: "請求錯誤" };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!res?.error) {
      // 认证成功
      return "success";
    } else {
      // 认证失败，处理错误
      return "error";
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
