"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBookBuilder } from "./_components/BookBuilderProvider";

export default function BookBuilderPage() {
  const router = useRouter();
  const { resetBookBuilder } = useBookBuilder();
  const hasStartedNewBook = useRef(false);

  useEffect(() => {
    if (hasStartedNewBook.current) return;
    hasStartedNewBook.current = true;
    resetBookBuilder();
    router.replace("/book-builder/choose-age");
  }, [resetBookBuilder, router]);

  return null;
}
