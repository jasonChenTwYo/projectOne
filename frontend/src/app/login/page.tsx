"use client";
import { useFormState } from "react-dom";
// import { authenticate } from "../../service/action";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

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
        router.push("/");
        router.refresh();
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
      <form className="flex items-center">
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
          <button formAction={dispatch} type="submit" className="mt-4 w-full">
            Log in
          </button>
        </div>
      </form>
    </main>
  );
}
