"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/redux/store";
import { setUserInfo } from "@/lib/redux/features/userInfoSlice";
import { Session } from "next-auth";

export default function StoreProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(
      setUserInfo({
        access_token: session?.access_token,
        account: session?.account,
      })
    );
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
