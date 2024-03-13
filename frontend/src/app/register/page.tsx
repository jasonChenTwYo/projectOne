"use client";
import { registerApi } from "@/service/api";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

export default function Page() {
  const router = useRouter();
  const [errorMessage, dispatch] = useFormState(register, undefined);
  async function register(prevState: string | undefined, formData: FormData) {
    try {
      const res = await registerApi(formData);
      if (res.message === "success") {
        router.push("/");
        return "success";
      } else {
        return "註冊失敗";
      }
    } catch (error) {
      return "error";
    }
  }

  return (
    <main className="container mx-auto bg-white py-20">
      <form className="flex flex-col items-center">
        <p className="text-pink-600">{errorMessage}</p>
        <label className="mb-3 mt-5 text-xs font-medium text-gray-900">
          <span>Account</span>
          <input
            className="w-72 block mt-2 peer rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
            id="account"
            type="text"
            name="account"
            placeholder="Enter your Account"
            required
          />
        </label>
        <label className="mb-3 mt-5 text-xs font-medium text-gray-900">
          <span>UserName</span>
          <input
            className="w-72 block mt-2 peer rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
            id="user_name"
            type="text"
            name="user_name"
            placeholder="Enter your UserName"
            required
          />
        </label>
        <label className="mb-3 mt-5 text-xs font-medium text-gray-900">
          <span>Email</span>
          <input
            className="w-72 block mt-2 peer rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
          <p className="mt-2 invisible peer-placeholder-shown:!invisible peer-invalid:visible text-pink-600 text-sm">
            Please provide a valid email address.
          </p>
        </label>
        <label className="mb-3 text-xs font-medium text-gray-900">
          <span>Password</span>
          <input
            className="w-72 block mt-2 rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            minLength={6}
          />
        </label>
        <button
          formAction={dispatch}
          type="submit"
          className="rounded-full py-2 px-5 bg-sky-500 mt-5 text-xs font-medium text-sky-200"
        >
          註冊
        </button>
      </form>
    </main>
  );
}
