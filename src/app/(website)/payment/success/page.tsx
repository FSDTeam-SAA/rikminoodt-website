"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { getApiBaseUrl } from "@/config/api";

type BookData = {
  _id: string;
  title?: string;
  status: "PENDING_PAYMENT" | "GENERATING" | "COMPLETED" | "FAILED" | "DRAFT" | "SUBMITTED";
  coverImageUrl?: string;
  pages?: Array<{ pageNumber: number; text: string; illustrationUrl?: string }>;
  generationError?: string;
};

const LOADING_MESSAGES = [
  "Weaving your magical storyline...",
  "Creating unique characters and whimsical scenes...",
  "Painting vibrant illustrations with AI...",
  "Formatting storybook typography and layouts...",
  "Adding your special touches and final magic sparkles...",
];

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookIdParam = searchParams.get("book_id");
  const [bookId, setBookId] = useState<string | null>(bookIdParam);
  const [book, setBook] = useState<BookData | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [progress, setProgress] = useState(25);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [pollError, setPollError] = useState("");

  useEffect(() => {
    if (!bookIdParam && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("current_book_id");
      if (stored) setBookId(stored);
    }
  }, [bookIdParam]);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4500);
    return () => clearInterval(msgTimer);
  }, []);

  useEffect(() => {
    const isGenerating = !book || book.status === "GENERATING" || book.status === "PENDING_PAYMENT";
    if (!isGenerating) return;

    const progTimer = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.floor(Math.random() * 4) + 1 : prev));
    }, 2000);
    return () => clearInterval(progTimer);
  }, [book?.status]);

  const fetchBookStatus = async (id: string) => {
    try {
      const apiBase = getApiBaseUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/books/${id}`, { headers });
      if (!res.ok) return;

      const json = await res.json();
      if (json?.data) {
        setBook(json.data);
        if (json.data.status === "COMPLETED") {
          setProgress(100);
        }
      }
    } catch (err: unknown) {
      console.error("Error polling book status:", err);
    }
  };

  useEffect(() => {
    if (!bookId) return;

    fetchBookStatus(bookId);
    const interval = setInterval(() => {
      fetchBookStatus(bookId);
    }, 3500);

    return () => clearInterval(interval);
  }, [bookId]);

  const handleRetry = async () => {
    if (!bookId || retryCount >= 5 || isRetrying) return;
    setIsRetrying(true);
    setPollError("");

    try {
      const apiBase = getApiBaseUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/books/${bookId}/retry`, {
        method: "POST",
        headers,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to restart generation.");

      setRetryCount((prev) => prev + 1);
      setProgress(25);
      if (json.data) setBook(json.data);
    } catch (err: unknown) {
      setPollError(err instanceof Error ? err.message : "Failed to retry generation.");
    } finally {
      setIsRetrying(false);
    }
  };

  const status = book?.status || "GENERATING";
  const isGenerating = status === "GENERATING" || status === "PENDING_PAYMENT";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  return (
    <main className="min-h-screen bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:px-16 lg:pt-[190px]">
      <section className="mx-auto max-w-xl text-center">
        <div className="rounded-[24px] border border-[#F3A8B7]/30 bg-[#FEFAF4] p-6 shadow-[0_12px_40px_rgba(80,40,50,0.08)] sm:p-10">
          {/* ICON */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl">
            {isGenerating && (
              <div className="flex size-20 items-center justify-center rounded-2xl bg-[#FDE9EE] text-[#E88DA0] shadow-inner">
                <Sparkles className="size-10 animate-spin text-[#E88DA0]" style={{ animationDuration: "6s" }} />
              </div>
            )}
            {isCompleted && (
              <div className="flex size-20 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#18B56E] shadow-inner">
                <CheckCircle2 className="size-10 text-[#18B56E]" />
              </div>
            )}
            {isFailed && (
              <div className="flex size-20 items-center justify-center rounded-2xl bg-[#FDE8E8] text-[#E53E3E] shadow-inner">
                <AlertCircle className="size-10 text-[#E53E3E]" />
              </div>
            )}
          </div>

          {/* STATUS VIEWS */}
          {isGenerating && (
            <div className="mt-6">
              <h1 className="font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
                Generating Your Magical Book
              </h1>
              <p className="mx-auto mt-3 min-h-[44px] max-w-md font-sans text-sm font-medium text-[#E88DA0] transition-all">
                {LOADING_MESSAGES[loadingMsgIndex]}
              </p>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex justify-between font-sans text-xs font-medium text-[#73686D]">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#F3D6DE]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F48FB1] via-[#E88DA0] to-[#FC5A00] transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <p className="mt-6 font-sans text-xs text-[#9A8F95]">
                Thank you for your order! Your payment was successful. Please do not close this window while AI weaves your personalised book.
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="mt-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] px-4 py-1.5 font-sans text-xs font-semibold text-[#18B56E]">
                <CheckCircle2 size={16} />
                <span>Book generation complete!</span>
              </div>
              <h1 className="mt-4 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
                {book?.title || "Your Book is Ready!"}
              </h1>
              <p className="mx-auto mt-2 max-w-md font-sans text-sm text-[#66605F]">
                Your unique storybook has been fully generated with all custom illustrations and story chapters!
              </p>

              {book?.coverImageUrl && (
                <div className="mx-auto mt-5 max-w-[160px] overflow-hidden rounded-xl border-2 border-[#E88DA0]/40 shadow-lg">
                  <Image
                    src={book.coverImageUrl}
                    alt={book?.title || "Book Cover"}
                    width={160}
                    height={210}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <Link
                  href={`/story-books/book-details/${book?._id || bookId}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-8 font-sans text-sm font-semibold text-white shadow-[0_5px_15px_rgba(232,141,160,0.35)] transition hover:bg-[#DD7893]"
                >
                  <BookOpen size={17} />
                  <span>Read Your Book Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {isFailed && (
            <div className="mt-6">
              <h1 className="font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
                Generation Encountered an Issue
              </h1>
              <p className="mx-auto mt-3 max-w-md font-sans text-sm text-[#B74760]">
                {book?.generationError ||
                  pollError ||
                  "Something went wrong while generating the book content."}
              </p>

              {/* RETRY LIMIT 5 */}
              <div className="mt-6 rounded-xl border border-[#F5CED7] bg-white p-5 text-left">
                <div className="flex items-center justify-between font-sans text-xs font-medium text-[#514256]">
                  <span>Retry attempt:</span>
                  <span className="font-bold text-[#E88DA0]">{retryCount} of 5</span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F5CED7]">
                  <div
                    className="h-full rounded-full bg-[#E88DA0] transition-all"
                    style={{ width: `${(retryCount / 5) * 100}%` }}
                  />
                </div>

                {retryCount >= 5 ? (
                  <p className="mt-4 font-sans text-xs font-semibold text-[#B74760]">
                    Maximum retry limit (5/5) reached. Please reach out to our team with Book ID: {bookId}.
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={isRetrying}
                    onClick={handleRetry}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-xs font-semibold text-white transition hover:bg-[#DD7893] disabled:opacity-60"
                  >
                    <RefreshCw size={14} className={isRetrying ? "animate-spin" : ""} />
                    <span>{isRetrying ? "Restarting generation..." : "Retry Generation"}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FEF6EC] px-4 pt-[150px] text-center font-sans text-sm text-[#66605F]">
          Loading your order status...
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

