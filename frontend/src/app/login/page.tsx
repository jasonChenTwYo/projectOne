"use client";
import { useFormState } from "react-dom";
import { authenticate, uploadVideo } from "../../service/action";

export default function Page() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const initialState = { message: "", erros: {} };
  const [state, formAction] = useFormState(uploadVideo, initialState);
  return (
    <main className="container mx-auto bg-white">
      {errorMessage}
      <form className="space-y-3">
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
          {state?.message ? state.message : "无消息"}
          <button formAction={dispatch} type="submit" className="mt-4 w-full">
            Log in
          </button>
        </div>
      </form>
    </main>
  );
}
