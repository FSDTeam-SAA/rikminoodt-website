/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { getApiBaseUrl } from "@/config/api";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "4JxZqv2Wm+qjN3s8dYkRf1h9Xc5aT0pMmm",

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const apiBase = getApiBaseUrl();

          const res = await fetch(`${apiBase}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email.trim(),
              password: credentials.password,
            }),
          });

          const response = await res.json();

          if (!res.ok) {
            const errorMsg =
              (Array.isArray(response?.message) ? response.message[0] : response?.message) ||
              "Invalid email or password";
            throw new Error(errorMsg);
          }

          const user = response?.data?.user;
          const accessToken = response?.data?.accessToken;

          if (!user) {
            throw new Error("User data not returned by server");
          }

          return {
            id: user?._id?.toString() || user?.id?.toString(),
            name: user?.name,
            email: user?.email,
            role: user?.role,
            profileImage: user?.profileImage,
            refreshToken: user?.refreshToken,
            accessToken,
          } as any;
        } catch (error) {
          console.error("Authentication error:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Authentication failed. Please try again.";
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }: { token: JWT; user?: any; trigger?: string; session?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.refreshToken = user.refreshToken;
        token.accessToken = user.accessToken;
      }
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.profileImage = token.profileImage;
        session.user.refreshToken = token.refreshToken;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
