"use client";

import { Category } from "@/lib/redux/features/videoInfoSlice";
import { getAllCategoryApi } from "@/service/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CubeIcon } from "@heroicons/react/24/solid";
export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
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
  return (
    <main className="grid grid-cols-4 gap-5 container mx-auto py-20">
      {categories.length > 0 &&
        categories.map((tag) => (
          <Link
            href={`/video/category/${tag.category_name}`}
            key={tag.category_id}
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            <CubeIcon className="w-6" />
            {tag.category_name}
          </Link>
        ))}
    </main>
  );
}
