"use client";

import { Category } from "@/common/response";
import { uploadVideo } from "@/service/action";
import { getAllCategoryApi, uploadVideoApi } from "@/service/api";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { z } from "zod";

export default function UploadVideoForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<Category[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const initialState = { message: "", erros: {} };
  const [state, formAction] = useFormState(uploadVideo, initialState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoryApi();
        setCategories(response.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (showDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]); // 依赖于 showDropdown 状态

  const addTag = (category: Category) => {
    if (!selectedTags.find((tag) => tag.category_id === category.category_id)) {
      setSelectedTags([...selectedTags, category]);
    } else {
      setSelectedTags(
        selectedTags.filter((tag) => tag.category_id !== category.category_id)
      );
    }
  };
  const removeTag = (categoryId: string) => {
    setSelectedTags(
      selectedTags.filter((tag) => tag.category_id !== categoryId)
    );
  };

  const uploadVideoSchema = z.object({
    title: z.string({
      invalid_type_error: "Invalid title",
    }),
  });

  type State = {
    errors?: {};
    message?: string;
  };

  async function uploadVideo(prevState: State, formData: FormData) {
    const validatedFields = uploadVideoSchema.safeParse({
      title: formData.get("title"),
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const categories: string[] = [];

    selectedTags.forEach((tag) => {
      categories.push(tag.category_id);
    });
    formData.append("categories ", categories.join(","));
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

      <div className="mt-2" ref={dropdownRef}>
        {selectedTags.map((tag) => (
          <div
            key={tag.category_id}
            className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mr-2"
          >
            {tag.category_name}
            <button
              type="button"
              onClick={() => removeTag(tag.category_id)}
              className="ml-2 text-blue-700 hover:text-blue-900"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium text-gray-700"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          + Add Tag
        </button>
        {showDropdown && (
          <>
            {categories.map((category) => {
              let name = category.category_name;
              const isSelected = selectedTags.some(
                (tag) => tag.category_id === category.category_id
              );
              if (isSelected) {
                name += " 已選擇";
              }

              return (
                <button
                  key={category.category_id}
                  type="button"
                  className="px-4 py-2 w-full text-left h-full"
                  onClick={() => addTag(category)}
                >
                  {name}
                </button>
              );
            })}
          </>
        )}
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
