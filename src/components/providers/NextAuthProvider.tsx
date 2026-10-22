"use client";

import { SessionProvider } from "next-auth/react";
import SessionPersistenceGuard from "./SessionPersistenceGuard";
import React from "react";

export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionPersistenceGuard>{children}</SessionPersistenceGuard>
    </SessionProvider>
  );
}

