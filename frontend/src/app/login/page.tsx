"use client";
import { useFormState } from "react-dom";
import { AuthError } from "next-auth";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hook";
import { setUserInfo } from "@/lib/redux/features/userInfoSlice";
export default function Page() {
  const router = useRouter();
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const appDispatch = useAppDispatch();

  async function authenticate(
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
        const session = await getSession();
        appDispatch(
          setUserInfo({
            access_token: session?.access_token,
            account: session?.account,
          })
        );
        router.push("/");
        return "success";
      } else {
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

  return (
    <main className="container mx-auto bg-white py-20">
      {errorMessage}
      <form className="flex flex-col items-center">
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
          Log in
        </button>
      </form>
    </main>
  );
}
