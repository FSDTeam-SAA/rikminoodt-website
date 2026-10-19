"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import { formatGenerationError } from "./generation-error";

type GenerationStatusModalProps = {
  isOpen: boolean;
  bookId: string | null;
  checkoutUrl?: string | null;
  onClose?: () => void;
};

type BookData = {
  _id: string;
  title?: string;
  status: "PENDING_PAYMENT" | "GENERATING" | "COMPLETED" | "FAILED" | "DRAFT" | "SUBMITTED";
  coverImageUrl?: string;
  pages?: Array<{ pageNumber: number; text: string; illustrationUrl?: string }>;
  generationError?: string;
  failureMessage?: string;
};

const LOADING_MESSAGES = [
  "Weaving your magical storyline...",
  "Creating unique characters and whimsical scenes...",
  "Painting vibrant illustrations with AI...",
  "Formatting storybook typography and layouts...",
  "Adding your special touches and final magic sparkles...",
];

export default function GenerationStatusModal({
  isOpen,
  bookId,
  checkoutUrl,
  onClose,
}: GenerationStatusModalProps) {
  const [book, setBook] = useState<BookData | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [pollError, setPollError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate inspiring messages while generating
  useEffect(() => {
    if (!isOpen) return;
    const msgTimer = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4500);
    return () => clearInterval(msgTimer);
  }, [isOpen]);

  // Animated progress bar simulation while generating
  useEffect(() => {
    if (!isOpen) return;
    const isGenerating = !book || book.status === "GENERATING" || book.status === "PENDING_PAYMENT";
    if (!isGenerating) return;

    const progTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + Math.floor(Math.random() * 4) + 1;
        return prev;
      });
    }, 2000);
    return () => clearInterval(progTimer);
  }, [isOpen, book?.status]);

  // Polling function
  const fetchBookStatus = async (id: string) => {
    try {
      const apiBase = getApiBaseUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/books/${id}`, { headers });
      if (!res.ok) {
        if (res.status === 401) {
          // Token expired or invalid
          setPollError("Session expired. Please log in to view book progress.");
        }
        return;
      }
      const json = await res.json();
      if (json?.data) {
        setBook(json.data);
        if (json.data.status === "COMPLETED") {
          setProgress(100);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }
    } catch (err: unknown) {
      console.error("Error polling book status:", err);
    }
  };

  useEffect(() => {
    if (!isOpen || !bookId) return;

    fetchBookStatus(bookId);

    intervalRef.current = setInterval(() => {
      fetchBookStatus(bookId);
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, bookId]);

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
      if (!res.ok) {
        throw new Error(json?.message || "Failed to restart generation.");
      }

      setRetryCount((prev) => prev + 1);
      setProgress(20);
      if (json.data) setBook(json.data);
    } catch (err: unknown) {
      setPollError(err instanceof Error ? err.message : "Failed to retry generation.");
    } finally {
      setIsRetrying(false);
    }
  };

  if (!isOpen) return null;

  const currentStatus = book?.status || (checkoutUrl ? "PENDING_PAYMENT" : "GENERATING");
  const isPendingPayment = currentStatus === "PENDING_PAYMENT";
  const isGenerating = currentStatus === "GENERATING";
  const isCompleted = currentStatus === "COMPLETED";
  const isFailed = currentStatus === "FAILED";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] border border-[#F3A8B7]/40 bg-[#FEFAF4] p-6 shadow-[0_20px_50px_rgba(50,30,40,0.25)] sm:p-8">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#FFE3DC] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-[#FCE3E7] opacity-60 blur-3xl" />

        <div className="relative z-10">
          {/* HEADER / ICON */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl sm:size-20">
            {isPendingPayment && (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FFF2DE] text-[#FC5A00] shadow-inner sm:size-20">
                <Sparkles className="size-8 animate-pulse text-[#FC5A00] sm:size-10" />
              </div>
            )}
            {isGenerating && (
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-[#FDE9EE] text-[#E88DA0] shadow-inner sm:size-20">
                <Sparkles className="size-8 animate-spin text-[#E88DA0] sm:size-10" style={{ animationDuration: "6s" }} />
              </div>
            )}
            {isCompleted && (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#18B56E] shadow-inner sm:size-20">
                <CheckCircle2 className="size-8 text-[#18B56E] sm:size-10" />
              </div>
            )}
            {isFailed && (
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FDE8E8] text-[#E53E3E] shadow-inner sm:size-20">
                <AlertCircle className="size-8 text-[#E53E3E] sm:size-10" />
              </div>
            )}
          </div>

          {/* TITLE & DESCRIPTION */}
          <div className="mt-5 text-center">
            {isPendingPayment && (
              <>
                <h3 className="font-crimson text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                  Almost Done! Complete Checkout
                </h3>
                <p className="mx-auto mt-2 max-w-[420px] font-sans text-xs leading-relaxed text-[#66605F] sm:text-sm">
                  Your personalized storybook structure has been registered. Complete payment to begin instant AI generation.
                </p>
                {checkoutUrl && (
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#FC5A00] font-sans text-sm font-semibold text-white shadow-[0_5px_15px_rgba(252,90,0,0.3)] transition hover:bg-[#E05000] focus:outline-none"
                    >
                      <span>Proceed to Payment (€8.99)</span>
                      <ExternalLink size={16} />
                    </a>
                    <span className="font-sans text-[11px] text-[#888]">
                      Generation will begin automatically upon payment completion.
                    </span>
                  </div>
                )}
              </>
            )}

            {isGenerating && (
              <>
                <h3 className="font-crimson text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                  Generating Your Magical Book
                </h3>
                <p className="mx-auto mt-2 min-h-[40px] max-w-[440px] font-sans text-xs font-medium text-[#E88DA0] transition-all duration-300 sm:text-sm">
                  {LOADING_MESSAGES[loadingMsgIndex]}
                </p>

                {/* Animated Progress Bar */}
                <div className="mt-5">
                  <div className="flex justify-between font-sans text-[11px] font-medium text-[#73686D]">
                    <span>Magic in progress...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F3D6DE]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F48FB1] via-[#E88DA0] to-[#FC5A00] transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 font-sans text-[11px] text-[#9A8F95]">
                  Please keep this page open. Storybooks usually take between 30 seconds to 2 minutes to generate all illustrations and chapters.
                </p>
              </>
            )}

            {isCompleted && (
              <>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] px-3 py-1 font-sans text-xs font-semibold text-[#18B56E]">
                  <CheckCircle2 size={14} />
                  <span>Book generation complete!</span>
                </div>
                <h3 className="mt-3 font-crimson text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                  {book?.title || "Your Storybook is Ready!"}
                </h3>
                <p className="mx-auto mt-2 max-w-[420px] font-sans text-xs text-[#66605F] sm:text-sm">
                  All pages and illustrations have been generated successfully. Your personalized children&apos;s book is ready to be read and shared.
                </p>

                {book?.coverImageUrl && (
                  <div className="mx-auto mt-4 max-w-[140px] overflow-hidden rounded-lg border-2 border-[#E88DA0]/40 shadow-md">
                    <Image
                      src={book.coverImageUrl}
                      alt={book?.title || "Book Cover"}
                      width={140}
                      height={180}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href={`/story-books/book-details/${book?._id || bookId}`}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-6 font-sans text-sm font-semibold text-white shadow-[0_5px_15px_rgba(232,141,160,0.35)] transition hover:bg-[#DD7893] sm:w-auto"
                  >
                    <BookOpen size={16} />
                    <span>Read Your Book Now</span>
                    <ArrowRight size={15} />
                  </Link>
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-11 w-full rounded-xl border border-[#D5C2C8] px-5 font-sans text-sm font-medium text-[#514256] transition hover:bg-white sm:w-auto"
                    >
                      Close
                    </button>
                  )}
                </div>
              </>
            )}

            {isFailed && (
              <>
                <h3 className="font-crimson text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                  Generation Failed
                </h3>
                <p className="mx-auto mt-2 max-w-[420px] font-sans text-xs leading-relaxed text-[#B74760] sm:text-sm">
                  {formatGenerationError(book?.generationError || book?.failureMessage || pollError)}
                </p>

                {/* RETRY SECTION WITH 5 COUNT LIMIT */}
                <div className="mt-5 rounded-xl border border-[#F5CED7] bg-white p-4">
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
                      Maximum retry limit (5/5) reached. Please contact customer support with Book ID: {bookId}.
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

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 font-sans text-xs text-[#856F77] underline underline-offset-4 hover:text-[#514256]"
                  >
                    Dismiss
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

