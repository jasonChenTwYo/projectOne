import {
  GetChannelInfoResponse,
  GetChannelVideoApiResponse,
} from "@/common/response";
import {
  deleteChannelVideoApi,
  getChannelInfoApi,
  getChannelVideoApi,
} from "@/service/api";
import { auth } from "@/lib/config/auth.config";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import Video from "@/app/ui/video/video";

const uploadVideoSchema = z.object({
  video_id: z.string({
    invalid_type_error: "Invalid title",
  }),
});

const Page: React.FC<{ params: { user: string } }> = async function ({
  params,
}: {
  params: { user: string };
}) {
  const result = await Promise.all<
    [
      Promise<GetChannelInfoResponse>,
      Promise<GetChannelVideoApiResponse>,
      Promise<Session | null>
    ]
  >([getChannelInfoApi(params.user), getChannelVideoApi(params.user), auth()]);

  const userInfo = result[0];
  const videoList = result[1].video_list;
  const currentUser = result[2];

  async function createInvoice(formData: FormData) {
    "use server";

    if (currentUser?.account === userInfo.account) {
      const validatedFields = uploadVideoSchema.safeParse({
        video_id: formData.get("video_id"),
      });

      // Return early if the form data is invalid
      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
        };
      }

      deleteChannelVideoApi(validatedFields.data.video_id);
      revalidatePath(`/user/${params.user}`);
      redirect(`/user/${params.user}`);
    }
  }

  return (
    <main className="grid grid-cols-4 gap-5 container mx-auto py-20">
      <div className="bg-white shadow-md rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold">用户信息</h2>
        {Object.entries(userInfo)
          .filter(([key]) => key != "message")
          .map(([key, value]: [key: string, value: string]) => (
            <p key={key} className="text-gray-600">{`${key}: ${value}`}</p>
          ))}
      </div>
      {videoList.map((video) => {
        return (
          <div key={`${video.video_id}`}>
            <Video videoInfo={video} />
            {currentUser && currentUser.account === userInfo.account && (
              <form action={createInvoice}>
                <input
                  name="video_id"
                  className="hidden"
                  value={video.video_id}
                  readOnly
                ></input>
                <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg">
                  刪除影片
                </button>
              </form>
            )}
          </div>
        );
      })}
    </main>
  );
};

export default Page;
