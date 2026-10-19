"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Receipt,
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
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookIdParam = searchParams.get("book_id");
  const statusParam = searchParams.get("status");

  const [bookId, setBookId] = useState<string | null>(bookIdParam);
  const [book, setBook] = useState<BookData | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [progress, setProgress] = useState(25);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [pollError, setPollError] = useState("");
  const [isAuthMissing, setIsAuthMissing] = useState(false);

  // If redirected with failed/cancelled status
  const isFailedParam =
    statusParam === "failed" ||
    statusParam === "cancelled" ||
    statusParam === "canceled" ||
    searchParams.get("canceled") === "true";

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
      setProgress((prev) => (prev < 92 ? prev + Math.floor(Math.random() * 3) + 1 : prev));
    }, 2000);
    return () => clearInterval(progTimer);
  }, [book?.status]);

  const fetchBookStatus = async (id: string) => {
    try {
      const apiBase = getApiBaseUrl();
      const token =
        session?.user?.accessToken ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      if (session?.user?.accessToken && typeof window !== "undefined") {
        localStorage.setItem("token", session.user.accessToken);
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/books/${id}`, { headers });
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthMissing(true);
        }
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setBook(json.data);
        setIsAuthMissing(false);
        if (json.data.status === "COMPLETED") {
          setProgress(100);
        }
      }
    } catch (err: unknown) {
      console.error("Error polling book status:", err);
    }
  };

  useEffect(() => {
    if (!bookId || isFailedParam) return;

    fetchBookStatus(bookId);
    const interval = setInterval(() => {
      fetchBookStatus(bookId);
    }, 3500);

    return () => clearInterval(interval);
  }, [bookId, isFailedParam, session]);

  const handleRetry = async () => {
    if (!bookId || retryCount >= 5 || isRetrying) return;
    setIsRetrying(true);
    setPollError("");

    try {
      const apiBase = getApiBaseUrl();
      const token =
        session?.user?.accessToken ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);
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

  // --- 1. PAYMENT FAILED / CANCELLED VIEW ---
  if (isFailedParam) {
    return (
      <main className="min-h-screen bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:px-16 lg:pt-[190px]">
        <section className="mx-auto max-w-lg text-center">
          <div className="rounded-[24px] border border-[#F3A8B7]/30 bg-[#FEFAF4] p-6 shadow-[0_12px_40px_rgba(80,40,50,0.08)] sm:p-10">
            <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-[#FFF0F2] text-[#E53E3E] shadow-inner">
              <AlertCircle className="size-10 text-[#E53E3E]" />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FFF0F2] px-4 py-1.5 font-sans text-xs font-semibold text-[#E53E3E]">
              <span className="size-2 rounded-full bg-[#E53E3E]" />
              <span>Payment Unsuccessful</span>
            </div>

            <h1 className="mt-4 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
              Payment Failed
            </h1>

            <p className="mx-auto mt-3 max-w-md font-sans text-sm text-[#66605F]">
              Your payment was not completed and you have not been charged. You can return to checkout to complete your book order.
            </p>

            <div className="mt-6 rounded-xl border border-[#F5CED7]/70 bg-white p-4 text-left sm:p-5">
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#8A7982]">
                Order Summary
              </h2>
              <div className="mt-3 space-y-2 font-sans text-xs">
                <div className="flex justify-between text-[#514256]">
                  <span className="text-[#8A7982]">Amount:</span>
                  <span className="font-semibold text-[#1E1E1E]">€8.99</span>
                </div>
                <div className="flex justify-between text-[#514256]">
                  <span className="text-[#8A7982]">Status:</span>
                  <span className="font-semibold text-[#E53E3E]">Failed / Cancelled</span>
                </div>
                {bookId && (
                  <div className="flex justify-between text-[#514256]">
                    <span className="text-[#8A7982]">Book Ref:</span>
                    <span className="font-mono text-[11px] text-[#514256]">{bookId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/book-builder/checkout"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-6 font-sans text-sm font-semibold text-white shadow-[0_4px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893]"
              >
                <RefreshCw size={15} />
                <span>Return to Checkout</span>
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#F3A8B7] bg-white px-6 font-sans text-sm font-medium text-[#514256] transition hover:bg-[#FFF0F3]"
              >
                <ArrowLeft size={15} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // --- 2. PAYMENT SUCCESS VIEW ---
  const status = book?.status || "GENERATING";
  const isGenerating = status === "GENERATING" || status === "PENDING_PAYMENT";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  return (
    <main className="min-h-screen bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:px-16 lg:pt-[190px]">
      <section className="mx-auto max-w-xl text-center">
        <div className="rounded-[24px] border border-[#F3A8B7]/30 bg-[#FEFAF4] p-6 shadow-[0_12px_40px_rgba(80,40,50,0.08)] sm:p-10">
          {/* SUCCESS HEADER */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#18B56E] shadow-inner">
            <CheckCircle2 className="size-10 text-[#18B56E]" />
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] px-4 py-1.5 font-sans text-xs font-semibold text-[#18B56E]">
            <CheckCircle2 size={15} />
            <span>Payment Successful</span>
          </div>

          <h1 className="mt-4 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
            Thank You for Your Order!
          </h1>

          <p className="mx-auto mt-2 max-w-md font-sans text-sm text-[#66605F]">
            We have received your payment of <span className="font-semibold text-[#0BA04B]">€8.99</span>. Your personalized book order has been confirmed!
          </p>

          {/* RECEIPT / ORDER DETAILS */}
          <div className="mt-6 rounded-xl border border-[#F3DDCE] bg-white p-4 text-left sm:p-5">
            <div className="flex items-center gap-2 border-b border-[#F5E5D8] pb-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#8A7982]">
              <Receipt size={14} className="text-[#E88DA0]" />
              <span>Payment Receipt</span>
            </div>

            <div className="mt-3 space-y-2 font-sans text-xs">
              <div className="flex justify-between text-[#514256]">
                <span className="text-[#8A7982]">Amount Paid:</span>
                <span className="font-bold text-[#0BA04B]">€8.99</span>
              </div>
              <div className="flex justify-between text-[#514256]">
                <span className="text-[#8A7982]">Payment Status:</span>
                <span className="font-semibold text-[#18B56E]">Paid & Verified</span>
              </div>
              {sessionId && (
                <div className="flex items-center justify-between text-[#514256]">
                  <span className="text-[#8A7982]">Transaction ID:</span>
                  <span className="font-mono text-[11px] text-[#514256]" title={sessionId}>
                    {sessionId.length > 20 ? `${sessionId.slice(0, 16)}...` : sessionId}
                  </span>
                </div>
              )}
              {bookId && (
                <div className="flex items-center justify-between text-[#514256]">
                  <span className="text-[#8A7982]">Book ID:</span>
                  <span className="font-mono text-[11px] text-[#514256]">{bookId}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI GENERATION STATUS CARD */}
          <div className="mt-6 rounded-2xl border border-[#F3A8B7]/40 bg-[#FFF9F5] p-5 sm:p-6 text-left">
            {/* 2.1 GENERATING STATE */}
            {isGenerating && !isAuthMissing && (
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#FDE9EE] text-[#E88DA0]">
                    <Sparkles className="size-5 animate-spin" style={{ animationDuration: "5s" }} />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm sm:text-base font-semibold text-[#1E1E1E]">
                      Generating Your Magical Book
                    </h2>
                    <p className="font-sans text-xs text-[#E88DA0] font-medium">
                      {LOADING_MESSAGES[loadingMsgIndex]}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between font-sans text-xs font-medium text-[#73686D]">
                    <span>AI Story & Illustration Progress</span>
                    <span className="font-bold text-[#FC5A00]">{progress}%</span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#F3D6DE]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F48FB1] via-[#E88DA0] to-[#FC5A00] transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 font-sans text-[11px] text-[#9A8F95] leading-relaxed">
                  Please keep this tab open while our AI writes and illustrates your storybook. You can also view it in your account settings once ready.
                </p>
              </div>
            )}

            {/* 2.2 COMPLETED STATE */}
            {isCompleted && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] px-3.5 py-1 font-sans text-xs font-semibold text-[#18B56E]">
                  <CheckCircle2 size={15} />
                  <span>Your book is ready!</span>
                </div>

                <h2 className="mt-3 font-crimson text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                  {book?.title || "Your Book is Ready!"}
                </h2>

                <p className="mt-1 font-sans text-xs sm:text-sm text-[#66605F]">
                  All custom chapters, characters, and vibrant illustrations have been created.
                </p>

                {book?.coverImageUrl && (
                  <div className="mx-auto mt-4 max-w-[150px] overflow-hidden rounded-xl border-2 border-[#E88DA0]/40 shadow-md">
                    <Image
                      src={book.coverImageUrl}
                      alt={book?.title || "Book Cover"}
                      width={150}
                      height={200}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  <Link
                    href={`/story-books/book-details/${book?._id || bookId}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-7 font-sans text-sm font-semibold text-white shadow-[0_4px_12px_rgba(232,141,160,0.3)] transition hover:bg-[#DD7893]"
                  >
                    <BookOpen size={16} />
                    <span>Read Your Book Now</span>
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/setting/generated-books"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#F3A8B7] bg-white px-6 font-sans text-sm font-medium text-[#514256] transition hover:bg-[#FFF0F3]"
                  >
                    <span>View in My Books</span>
                  </Link>
                </div>
              </div>
            )}

            {/* 2.3 FAILED STATE WITH RETRY (UP TO 5) */}
            {isFailed && (
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#FFF0F2] text-[#E53E3E]">
                    <AlertCircle className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm sm:text-base font-semibold text-[#1E1E1E]">
                      Generation Encountered an Issue
                    </h2>
                    <p className="font-sans text-xs text-[#B74760]">
                      {book?.generationError || pollError || "An unexpected issue occurred during AI generation."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#F5CED7] bg-white p-4">
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
                    <p className="mt-3 font-sans text-xs font-semibold text-[#B74760]">
                      Maximum retries (5/5) reached. Please contact support with Book ID: {bookId}.
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={isRetrying}
                      onClick={handleRetry}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-xs font-semibold text-white transition hover:bg-[#DD7893] disabled:opacity-60"
                    >
                      <RefreshCw size={14} className={isRetrying ? "animate-spin" : ""} />
                      <span>{isRetrying ? "Restarting generation..." : "Retry Generation"}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2.4 GUEST / RE-LOGIN GUIDANCE */}
            {isAuthMissing && (
              <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FDE9EE] text-[#E88DA0]">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm sm:text-base font-semibold text-[#1E1E1E]">
                      Your Book is Being Created!
                    </h2>
                    <p className="font-sans text-xs text-[#66605F] mt-0.5">
                      Your order is verified. Log in with the account you provided to access your completed book in real time.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/login"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-6 font-sans text-xs font-semibold text-white transition hover:bg-[#DD7893]"
                  >
                    <span>Log In to View Book</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/setting/generated-books"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#F3A8B7] bg-white px-5 font-sans text-xs font-medium text-[#514256] transition hover:bg-[#FFF0F3]"
                  >
                    <span>My Books</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* HOME LINK */}
          <div className="mt-7">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-[#8A7982] hover:text-[#E88DA0] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Boekerello Home</span>
            </Link>
          </div>
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
