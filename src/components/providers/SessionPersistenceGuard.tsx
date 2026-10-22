"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

const SESSION_MODE_KEY = "boekerello_session_mode";
const SESSION_MARKER_KEY = "boekerello_auth_session";

export default function SessionPersistenceGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isSigningOut = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || isSigningOut.current) return;
    if (localStorage.getItem(SESSION_MODE_KEY) !== "session") return;
    if (sessionStorage.getItem(SESSION_MARKER_KEY) === "active") return;

    isSigningOut.current = true;
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    void signOut({ redirect: false });
  }, [status]);

  return <>{children}</>;
}
