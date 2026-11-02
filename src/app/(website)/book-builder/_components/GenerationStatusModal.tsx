"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  X,
  Mail,
} from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import { formatGenerationError } from "./generation-error";

function RocketIllustration({ className = "size-12" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Exhaust Flame */}
      <path
        d="M19 43C19 43 20.5 53 24 57C27.5 53 29 43 29 43H19Z"
        fill="#FBBF24"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 43C21.5 43 22.5 49 24 51.5C25.5 49 26.5 43 26.5 43H21.5Z"
        fill="#F59E0B"
      />

      {/* Left Fin */}
      <path
        d="M15 35C10.5 35 5.5 39 4.5 43C8.5 43 14 42 16.5 38L15 35Z"
        fill="#7F6EA0"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Right Fin */}
      <path
        d="M33 35C37.5 35 42.5 39 43.5 43C39.5 43 34 42 31.5 38L33 35Z"
        fill="#557F77"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Rocket Main Body */}
      <path
        d="M24 3C17 11 14 26 15 43H33C34 26 31 11 24 3Z"
        fill="#F472B6"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Window / Porthole */}
      <circle
        cx="24"
        cy="20"
        r="6"
        fill="#38BDF8"
        stroke="#24222B"
        strokeWidth="2"
      />
      <circle cx="26" cy="18" r="1.5" fill="white" />
    </svg>
  );
}

function ModalConfettiDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]"
      aria-hidden="true"
    >
      {/* Top Left Corner */}
      <div className="absolute -left-6 -top-6 size-28 rounded-full bg-[#E2ECE6]" />
      <svg
        className="absolute left-11 top-10 size-4 rotate-12 text-[#6BA4D8]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <polygon points="10,0 20,20 0,20" />
      </svg>
      <svg
        className="absolute left-5 top-16 size-5 text-[#FFB830]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="absolute left-4 top-28 size-2 rounded-full bg-[#FF7A59]" />
      <span className="absolute left-16 top-6 size-2 rounded-full bg-[#FFB830]" />

      {/* Top Right Corner */}
      <div className="absolute -right-6 -top-6 size-28 rounded-full bg-[#FDDCD8]" />
      <span className="absolute right-16 top-14 size-2.5 rounded-full bg-[#70B984]" />
      <svg
        className="absolute right-7 top-20 size-4 -rotate-45 text-[#F58778]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <polygon points="10,0 20,20 0,20" />
      </svg>
      <span className="absolute right-4 top-32 size-2 rounded-full bg-[#FFB830]" />

      {/* Bottom Left Corner */}
      <div className="absolute -bottom-6 -left-6 size-24 rounded-full bg-[#FCE3EB]" />
      <span className="absolute bottom-24 left-4 size-2 rounded-full bg-[#70B984]" />
      <span className="absolute bottom-16 left-5 size-2 rounded-full bg-[#FFB830]" />

      {/* Bottom Right Corner */}
      <div className="absolute -bottom-8 -right-8 size-28 rounded-full bg-[#FDE8B3]" />
      <svg
        className="absolute bottom-2 right-2 h-16 w-16"
        viewBox="0 0 60 60"
        fill="none"
      >
        <path
          d="M12 48C32 46 46 32 48 12"
          stroke="#7BC7C1"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute bottom-24 right-4 size-2 rounded-full bg-[#FF7A59]" />
    </div>
  );
}

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
  failureType?: "CONTENT_MODERATION" | "IMAGE_QUALITY" | "TIMEOUT" | "SERVER_ERROR";
  failureMessage?: string;
};

export default function GenerationStatusModal({
  isOpen,
  bookId,
  checkoutUrl,
  onClose,
}: GenerationStatusModalProps) {
  const router = useRouter();
  const [book, setBook] = useState<BookData | null>(null);
  const [progress, setProgress] = useState(15);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [pollError, setPollError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [isOpen, book]);

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

  const redirectToWizard = () => {
    if (!bookId) return;
    // Keep the existing wizard data and mark this as an edit-and-retry flow.
    // The checkout step will send the updated FormData to POST /books/:id/retry.
    window.sessionStorage.setItem("retry_book_id", bookId);
    router.push("/book-builder/InformationAboutCharacters");
  };

  if (!isOpen) return null;

  const currentStatus = book?.status || (checkoutUrl ? "PENDING_PAYMENT" : "GENERATING");
  const isPendingPayment = currentStatus === "PENDING_PAYMENT";
  const isGenerating = currentStatus === "GENERATING";
  const isCompleted = currentStatus === "COMPLETED";
  const isFailed = currentStatus === "FAILED";
  const failureType = book?.failureType;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2330]/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[450px] overflow-hidden rounded-[36px] border border-[#FBE5EC] bg-[#FFFDFB] p-6 pt-7 pb-7 text-center shadow-[0_24px_60px_rgba(60,30,50,0.22)] sm:p-8 sm:pt-9 sm:pb-8">
        <ModalConfettiDecorations />

        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full text-[#4B4650] transition hover:bg-[#FCE6EE] hover:text-[#252025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        )}

        <div className="relative z-10 flex flex-col items-center">
          {/* HEADER / ICON */}
          <div
            className={`flex size-20 items-center justify-center rounded-[24px] sm:size-[84px] ${
              isPendingPayment
                ? "bg-[#FFF2DE] text-[#FC5A00] shadow-sm"
                : isGenerating
                  ? "bg-[#FFE4ED] shadow-sm"
                  : isCompleted
                    ? "bg-[#E6F7ED] text-[#18B56E]"
                    : "bg-[#FFF0F2] text-[#B74760]"
            }`}
          >
            {isPendingPayment && (
              <Sparkles className="size-9 animate-pulse text-[#FC5A00]" />
            )}
            {isGenerating && (
              <RocketIllustration className="h-14 w-12" />
            )}
            {isCompleted && (
              <CheckCircle2 className="size-9 text-[#18B56E]" />
            )}
            {isFailed && (
              <AlertCircle className="size-9 text-[#E53E3E]" />
            )}
          </div>

          {/* TITLE & DESCRIPTION */}
          <div className="mt-5 w-full text-center">
            {isPendingPayment && (
              <>
                <h3 className="font-sans text-2xl font-bold leading-tight tracking-tight text-[#162035] sm:text-[28px]">
                  Almost Done! Complete Checkout
                </h3>
                <p className="mx-auto mt-2 max-w-[360px] font-sans text-xs leading-relaxed text-[#66605F] sm:text-sm">
                  Your personalized storybook structure has been registered. Complete payment to begin instant AI generation.
                </p>
                {checkoutUrl && (
                  <div className="mt-5 flex flex-col items-center gap-3">
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
                <h3 className="font-sans text-2xl font-bold leading-tight tracking-tight text-[#162035] sm:text-[28px]">
                  We&apos;re creating your magical book
                </h3>
                <p className="mx-auto mt-2.5 max-w-[340px] font-sans text-sm leading-[1.5] text-[#5A5560] sm:text-[15px]">
                  We&apos;re writing and illustrating your story. This window will close once your book is ready.
                </p>

                {/* Progress Box */}
                <div className="mt-5 w-full rounded-[22px] border border-[#FBD6E0] bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center justify-between font-sans text-xs font-bold sm:text-[13px]">
                    <span className="text-[#162035]">Adding the final magical touches...</span>
                    <span className="text-[#ED3875]">{progress}%</span>
                  </div>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#FCE3EB]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ED3875] via-[#F4608B] to-[#FF7A59] transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(progress, 5)}%` }}
                    />
                  </div>
                  <p className="mt-3 font-sans text-xs font-normal text-[#756F7C]">
                    This may take a few minutes.
                  </p>
                </div>

                <p className="mx-auto mt-4 max-w-[320px] font-sans text-xs font-medium leading-relaxed text-[#5A5560] sm:text-[13px]">
                  You can close this window and check the status on this page later.
                </p>

                {/* Email Pill Banner */}
                <div className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#FCDCE6] bg-[#FFEBF1] px-4 py-2 sm:px-5 sm:py-2.5">
                  <Mail className="size-4 shrink-0 text-[#ED3875]" />
                  <span className="font-sans text-xs font-semibold text-[#162035] sm:text-[12.5px]">
                    You&apos;ll receive an email as soon as the PDF is ready.
                  </span>
                </div>
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
                {failureType && (
                  <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-wide text-[#856F77]">
                    Failure type: {failureType.replaceAll("_", " ")}
                  </p>
                )}

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
                  ) : failureType === "CONTENT_MODERATION" ? (
                    <button
                      type="button"
                      onClick={redirectToWizard}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-xs font-semibold text-white transition hover:bg-[#DD7893]"
                    >
                      Edit Story &amp; Retry
                    </button>
                  ) : failureType === "IMAGE_QUALITY" ? (
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        disabled={isRetrying}
                        onClick={handleRetry}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-xs font-semibold text-white transition hover:bg-[#DD7893] disabled:opacity-60"
                      >
                        <RefreshCw size={14} className={isRetrying ? "animate-spin" : ""} />
                        <span>{isRetrying ? "Restarting generation..." : "Retry Generation"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={redirectToWizard}
                        className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#E88DA0] bg-white font-sans text-xs font-semibold text-[#C75D78] transition hover:bg-[#FFF3F5]"
                      >
                        Change Photo &amp; Retry
                      </button>
                    </div>
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

