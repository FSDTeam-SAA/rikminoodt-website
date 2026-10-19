"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import BookCard from "./BookCard";

type Book = {
  _id: string;
  title?: string;
  subject?: string;
  coverImageUrl?: string;
  status: string;
};

export default function GeneratedBooksMain() {
  const { data: session, status: sessionStatus } = useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    const controller = new AbortController();
    const token = session?.user?.accessToken || localStorage.getItem("token");
    setBooks([]);
    setError("");
    setNeedsLogin(false);
    if (!token) {
      setNeedsLogin(true);
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);
    const loadBooks = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/books`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json().catch(() => null);
        if (response.status === 401 || response.status === 403) {
          if (!controller.signal.aborted) {
            if (response.status === 401) setNeedsLogin(true);
            else setError("Your account cannot access these books. Please contact support.");
          }
          return;
        }
        if (!response.ok) throw new Error(result?.message || "Unable to load your books.");
        if (!Array.isArray(result?.data)) throw new Error("The server returned an unexpected book list.");
        if (!controller.signal.aborted) setBooks(result.data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load your books.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void loadBooks();
    return () => controller.abort();
  }, [sessionStatus, session?.user?.accessToken, retry]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 font-serif text-2xl text-gray-800">Generated Books</h1>
          <p className="text-sm text-gray-500">View your storybooks and their current status.</p>
        </div>
        <Link href="/book-builder/choose-age" className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#d67288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A]">
          <span>Create Book</span><Plus size={18} aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <p role="status" className="py-8 text-center text-sm text-gray-500">Loading your books…</p>
      ) : needsLogin ? (
        <div className="py-8 text-center text-sm text-gray-600">
          <p>Please sign in to view your books.</p>
          <Link href="/login" className="mt-3 inline-block font-semibold text-[#c45c77] underline">Sign in</Link>
        </div>
      ) : error ? (
        <div role="alert" className="py-8 text-center text-sm text-[#a34259]">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold underline">Try again</button>
        </div>
      ) : books.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">You don&apos;t have any books yet. Create a story to get started.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {books.map((book) => (
            <BookCard
              key={book._id}
              id={book._id}
              title={book.title || (book.subject ? book.subject.toLowerCase().replaceAll("_", " ") : "Your storybook")}
              imageSrc={book.coverImageUrl}
              status={book.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
