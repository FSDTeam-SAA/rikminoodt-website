"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, BookOpen, Sparkles, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface BookCardProps {
  id?: string;
  title: string;
  imageSrc?: string;
  status: string;
  paidAt?: string | null;
  stripeSessionId?: string | null;
}

export default function BookCard({ id, title, imageSrc, status, paidAt, stripeSessionId }: BookCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [showUnpaidNotice, setShowUnpaidNotice] = useState(false);
  const [showPendingNotice, setShowPendingNotice] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const { data: authSession } = useSession();
  const { t } = useLanguage();
  const copy = t.settings.generated;
  const statusLabels: Record<string, string> = {
    DRAFT: copy.draft,
    PENDING_PAYMENT: copy.awaitingPayment,
    SUBMITTED: copy.submitted,
    GENERATING: copy.generating,
    COMPLETED: copy.completed,
    FAILED: copy.generationFailed,
  };

  const card = (
    <article className="group flex min-w-0 flex-col items-center transition-transform duration-200 hover:-translate-y-1">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#f9edf0] shadow-lg transition-shadow duration-200 group-hover:shadow-xl">
        {imageSrc && !imageFailed ? (
          <Image
            src={imageSrc}
            alt={`${copy.coverOf} ${title}`}
            fill
            unoptimized
            onError={() => setImageFailed(true)}
            className="object-cover"
            sizes="(max-width: 767px) 45vw, (max-width: 1199px) 30vw, 20vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-[#a66b7e]">
            <BookOpen size={36} aria-hidden="true" />
            <span className="font-crimson text-lg font-semibold">{title}</span>
          </div>
        )}
      </div>
      <div aria-hidden="true" className="-mt-0.5 h-3 w-[105%] rounded-b-md border-t border-[#C08C4A] bg-[#D29D59] shadow-md" />
      <h2 className="mt-3 w-full break-words text-center text-sm font-semibold text-[#514256] transition-colors group-hover:text-[#E3859A]">
        {title}
      </h2>
      <p className="mt-1 text-center text-xs text-[#81717a]">
        {statusLabels[status] ?? status.toLowerCase().replaceAll("_", " ")}
      </p>
    </article>
  );

  const isFailed = status === "FAILED";

  // Failed after payment: open the regenerate flow (payment success page).
  if (id && isFailed && paidAt && stripeSessionId) {
    const retryHref = `/payment/success?book_id=${encodeURIComponent(id)}&session_id=${encodeURIComponent(stripeSessionId)}`;
    return (
      <Link href={retryHref} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] rounded-md">
        {card}
      </Link>
    );
  }

  // Paid and currently generating: show the live progress page.
  if (id && status === "GENERATING" && paidAt && stripeSessionId) {
    const progressHref = `/payment/success?book_id=${encodeURIComponent(id)}&session_id=${encodeURIComponent(stripeSessionId)}`;
    return (
      <Link href={progressHref} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] rounded-md">
        {card}
      </Link>
    );
  }

  // Awaiting payment: the book has no content yet, so offer to finish paying.
  if (id && status === "PENDING_PAYMENT") {
    const completePayment = async () => {
      if (payLoading) return;
      setPayLoading(true);
      setPayError("");
      try {
        const token = authSession?.user?.accessToken || localStorage.getItem("token");
        if (!token) throw new Error(copy.pendingSignIn);
        const response = await fetch(`${getApiBaseUrl()}/payments/generation/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ bookId: id }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.data?.checkoutUrl) throw new Error(result?.message || copy.pendingError);
        const url = new URL(result.data.checkoutUrl);
        if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com") throw new Error(copy.pendingError);
        window.location.assign(url.href);
      } catch (err) {
        setPayError(err instanceof Error ? err.message : copy.pendingError);
        setPayLoading(false);
      }
    };
    return (
      <>
        <button
          type="button"
          onClick={() => { setPayError(""); setShowPendingNotice(true); }}
          className="block w-full rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A]"
        >
          {card}
        </button>
        {showPendingNotice && (
          <UnpaidFailedNotice
            variant="pending"
            title={copy.pendingTitle}
            description={copy.pendingDescription}
            createLabel={copy.unpaidFailedCreate}
            closeLabel={copy.unpaidFailedClose}
            primaryLabel={payLoading ? copy.pendingRedirecting : copy.pendingPay}
            primaryDisabled={payLoading}
            onPrimary={completePayment}
            error={payError}
            onClose={() => setShowPendingNotice(false)}
          />
        )}
      </>
    );
  }

  // Failed without payment: nothing to retry and no content to read.
  if (id && isFailed && !paidAt) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowUnpaidNotice(true)}
          className="block w-full rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A]"
        >
          {card}
        </button>
        {showUnpaidNotice && (
          <UnpaidFailedNotice
            variant="failed"
            title={copy.unpaidFailedTitle}
            description={copy.unpaidFailedDescription}
            createLabel={copy.unpaidFailedCreate}
            closeLabel={copy.unpaidFailedClose}
            onClose={() => setShowUnpaidNotice(false)}
          />
        )}
      </>
    );
  }

  if (id) {
    return (
      <Link href={`/story-books/book-details/${id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] rounded-md">
        {card}
      </Link>
    );
  }

  return card;
}

function NoticeConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]" aria-hidden="true">
      <div className="absolute -left-6 -top-6 size-28 rounded-full bg-[#E2ECE6]" />
      <svg className="absolute left-11 top-10 size-4 rotate-12 text-[#6BA4D8]" viewBox="0 0 20 20" fill="currentColor">
        <polygon points="10,0 20,20 0,20" />
      </svg>
      <span className="absolute left-4 top-28 size-2 rounded-full bg-[#FF7A59]" />
      <span className="absolute left-16 top-6 size-2 rounded-full bg-[#FFB830]" />
      <div className="absolute -right-6 -top-6 size-28 rounded-full bg-[#FDDCD8]" />
      <span className="absolute right-16 top-14 size-2.5 rounded-full bg-[#70B984]" />
      <span className="absolute right-4 top-32 size-2 rounded-full bg-[#FFB830]" />
      <div className="absolute -bottom-6 -left-6 size-24 rounded-full bg-[#FCE3EB]" />
      <span className="absolute bottom-16 left-5 size-2 rounded-full bg-[#FFB830]" />
      <div className="absolute -bottom-8 -right-8 size-28 rounded-full bg-[#FDE8B3]" />
      <span className="absolute bottom-24 right-4 size-2 rounded-full bg-[#FF7A59]" />
    </div>
  );
}

function UnpaidFailedNotice({
  variant,
  title,
  description,
  createLabel,
  closeLabel,
  onClose,
  primaryLabel,
  primaryDisabled,
  onPrimary,
  error,
}: {
  variant: "pending" | "failed";
  title: string;
  description: string;
  createLabel: string;
  closeLabel: string;
  onClose: () => void;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  onPrimary?: () => void;
  error?: string;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isPending = variant === "pending";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2330]/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[450px] overflow-hidden rounded-[36px] border border-[#FBE5EC] bg-[#FFFDFB] p-6 pb-7 pt-7 text-center shadow-[0_24px_60px_rgba(60,30,50,0.22)] sm:p-8 sm:pb-8 sm:pt-9"
        onClick={(event) => event.stopPropagation()}
      >
        <NoticeConfetti />

        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full text-[#4B4650] transition hover:bg-[#FCE6EE] hover:text-[#252025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
        >
          <X size={20} strokeWidth={2.2} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`flex size-20 items-center justify-center rounded-[24px] shadow-sm sm:size-[84px] ${
              isPending ? "bg-[#FFF2DE] text-[#FC5A00]" : "bg-[#FFF0F2] text-[#E53E3E]"
            }`}
          >
            {isPending ? <Sparkles className="size-9" aria-hidden="true" /> : <AlertCircle className="size-9" aria-hidden="true" />}
          </div>

          <h3 className="mt-5 font-sans text-2xl font-bold leading-tight tracking-tight text-[#162035] sm:text-[28px]">
            {title}
          </h3>
          <p className="mx-auto mt-2.5 max-w-[360px] font-sans text-sm leading-relaxed text-[#66605F]">
            {description}
          </p>
          {error && (
            <p role="alert" className="mx-auto mt-3 max-w-[360px] font-sans text-xs font-medium text-[#B74760]">
              {error}
            </p>
          )}

          <div className="mt-6 flex w-full flex-col items-center gap-3">
            {onPrimary && (
              <button
                type="button"
                onClick={onPrimary}
                disabled={primaryDisabled}
                className="inline-flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-[#FC5A00] font-sans text-sm font-semibold text-white shadow-[0_5px_15px_rgba(252,90,0,0.3)] transition hover:bg-[#E05000] focus:outline-none disabled:opacity-60"
              >
                {primaryLabel}
              </button>
            )}
            <Link
              href="/book-builder/choose-age"
              className={`inline-flex w-full max-w-sm items-center justify-center rounded-xl font-sans text-sm font-semibold transition ${
                onPrimary
                  ? "h-11 border border-[#E88DA0] bg-white text-[#C75D78] hover:bg-[#FFF3F5]"
                  : "h-12 bg-[#E88DA0] text-white shadow-[0_5px_15px_rgba(232,141,160,0.35)] hover:bg-[#DD7893]"
              }`}
            >
              {createLabel}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="font-sans text-xs text-[#856F77] underline underline-offset-4 hover:text-[#514256]"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
