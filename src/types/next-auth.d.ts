import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    _id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    profileImage?: string;
    refreshToken?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      profileImage?: string;
      accessToken?: string;
      refreshToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    profileImage?: string;
    refreshToken?: string;
    accessToken?: string;
  }
}

