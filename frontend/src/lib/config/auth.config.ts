import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    /** The user's postal address. */
    account: string;
    access_token: string;
  }
  interface Session {
    account: string;
    access_token: string;
  }
}

const authConfig = {
  secret: process.env.AUTH_SECRET ?? "189e883f3dd8a0bea87a1a419344220d",
  session: { strategy: "jwt", maxAge: 86400 },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const formData = new FormData();
          formData.append("username", email);
          formData.append("password", password);
          const authResponse = await fetch(
            `${
              process.env.PROXY_HOST
                ? `${process.env.PROXY_HOST}/api`
                : "http://127.0.0.1:8000"
            }/login/access-token`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!authResponse.ok) {
            console.log("error");
            return null;
          }

          const user = await authResponse.json();

          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = auth?.user;
      const protectedUrls = ["/video/upload", "/video/history"];
      const isProtectUrl = protectedUrls.includes(nextUrl.pathname);
      if (isProtectUrl) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname === "/register") {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
    jwt({ token, user, account }) {
      if (account) {
        console.log("token: " + JSON.stringify(token));
        console.log("user: " + JSON.stringify(user));
        console.log("account: " + JSON.stringify(account));
        token.access_token = user.access_token;
        token.account = user.account;
      }
      return token;
    },
    session({ session, token }) {
      const parsedCredentials = z
        .object({
          access_token: z.string().uuid(),
          account: z.string(),
        })
        .safeParse(token);
      if (parsedCredentials.success) {
        const { access_token, account } = parsedCredentials.data;
        session.access_token = access_token;
        session.account = account;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
