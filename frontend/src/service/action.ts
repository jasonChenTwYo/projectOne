import { z } from "zod";
import { uploadVideoApi } from "@/service/api";

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
    console.log(`response.status:${response.status}`);
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
