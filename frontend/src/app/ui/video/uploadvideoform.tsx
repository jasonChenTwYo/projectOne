"use client";

import { uploadVideo } from "@/service/action";
import { useFormState } from "react-dom";

export default function UploadVideoForm() {
  const initialState = { message: "", erros: {} };
  const [state, formAction] = useFormState(uploadVideo, initialState);

  return (
    <form className="flex flex-col p-4 space-y-4 bg-white shadow-md rounded-lg">
      <div className="text-lg font-semibold text-gray-700">
        {state?.message ? state.message : "无消息"}
      </div>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title:
        </label>
        <input
          name="title"
          id="title"
          type="text"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="category_id"
          className="block text-sm font-medium text-gray-700"
        >
          種類:
        </label>
        {/* <select
          name="category_id"
          id="category_id"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
        >
          <option value="" disabled selected>
            Select your option
          </option> */}
        {/* 假設 categories 是您的類別數組 */}
        {/* {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))} */}
        {/* </select> */}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          description:
        </label>
        <input
          name="description"
          id="description"
          type="text"
          className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">
          Video File:
        </span>
        <input
          name="video_file"
          type="file"
          accept="video/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">
          Thumbnail File:
        </span>
        <input
          name="thumbnail_file"
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <button
        formAction={formAction}
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Upload
      </button>
    </form>
  );
}
