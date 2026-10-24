"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import BookCard from "./BookCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Book = {
  _id: string;
  title?: string;
  subject?: string;
  coverImageUrl?: string;
  status: string;
};

export default function GeneratedBooksMain() {
  const { data: session, status: sessionStatus } = useSession();
  const { t } = useLanguage();
  const copy = t.settings.generated;
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
            else setError(copy.accessDenied);
          }
          return;
        }
        if (!response.ok) throw new Error(result?.message || copy.loadFailed);
        if (!Array.isArray(result?.data)) throw new Error(copy.unexpectedList);
        if (!controller.signal.aborted) setBooks(result.data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : copy.loadFailed);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void loadBooks();
    return () => controller.abort();
  }, [copy.accessDenied, copy.loadFailed, copy.unexpectedList, sessionStatus, session?.user?.accessToken, retry]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 font-serif text-2xl text-gray-800">{t.settings.generatedBooks}</h1>
          <p className="text-sm text-gray-500">{copy.description}</p>
        </div>
        <Link href="/book-builder/choose-age" className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#d67288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A]">
          <span>{copy.createBook}</span><Plus size={18} aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div role="status" aria-label={copy.loading} className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] rounded-2xl bg-[#F6EEF1]" />
              <div className="mt-4 h-4 w-4/5 rounded-full bg-[#F3E7EB]" />
              <div className="mt-2 h-3 w-3/5 rounded-full bg-[#F7EFF2]" />
            </div>
          ))}
        </div>
      ) : needsLogin ? (
        <div className="py-8 text-center text-sm text-gray-600">
          <p>{copy.signInToView}</p>
          <Link href="/login" className="mt-3 inline-block font-semibold text-[#c45c77] underline">{copy.signIn}</Link>
        </div>
      ) : error ? (
        <div role="alert" className="py-8 text-center text-sm text-[#a34259]">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold underline">{copy.tryAgain}</button>
        </div>
      ) : books.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">{copy.empty}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {books.map((book) => (
            <BookCard
              key={book._id}
              id={book._id}
              title={book.title || (book.subject ? book.subject.toLowerCase().replaceAll("_", " ") : copy.yourStorybook)}
              imageSrc={book.coverImageUrl}
              status={book.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
