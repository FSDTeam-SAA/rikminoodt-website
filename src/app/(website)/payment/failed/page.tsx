"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("book_id");
  const errorMessage =
    searchParams.get("error") ||
    searchParams.get("message") ||
    "Your payment was declined or could not be processed by your bank. No charges were made.";

  return (
    <main className="min-h-screen bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:px-16 lg:pt-[190px]">
      <section className="mx-auto max-w-lg text-center">
        <div className="rounded-[24px] border border-[#F3A8B7]/30 bg-[#FEFAF4] p-6 shadow-[0_12px_40px_rgba(80,40,50,0.08)] sm:p-10">
          {/* FAILED BADGE & ICON */}
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
            {errorMessage}
          </p>

          {/* DETAILS CARD */}
          <div className="mt-6 rounded-xl border border-[#F5CED7]/70 bg-white p-4 text-left sm:p-5">
            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#8A7982]">
              Order Information
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

          <div className="mt-5 rounded-lg bg-[#FFF9F5] p-3 text-left font-sans text-xs text-[#7A6A74]">
            <p className="font-semibold text-[#31445D]">Tips to resolve this:</p>
            <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px] text-[#536278]">
              <li>Ensure your card has sufficient funds and is enabled for online transactions.</li>
              <li>Check that card number, expiry date, and CVV are entered correctly.</li>
              <li>Try using a different card or payment method.</li>
            </ul>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/book-builder/checkout"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-6 font-sans text-sm font-semibold text-white shadow-[0_4px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893]"
            >
              <RefreshCw size={15} />
              <span>Try Payment Again</span>
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

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FEF6EC] px-4 pt-[150px] text-center font-sans text-sm text-[#66605F]">
          Loading...
        </main>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
