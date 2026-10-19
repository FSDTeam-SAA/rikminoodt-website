import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:px-16 lg:pt-[190px]">
      <section className="mx-auto max-w-md text-center">
        <div className="rounded-[24px] border border-[#F3A8B7]/30 bg-[#FEFAF4] p-6 shadow-[0_12px_40px_rgba(80,40,50,0.08)] sm:p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#FFF0F2] text-[#E53E3E]">
            <XCircle className="size-8" />
          </div>
          <h1 className="mt-5 font-crimson text-3xl font-bold text-[#1E1E1E]">
            Payment Cancelled
          </h1>
          <p className="mt-2 font-sans text-sm text-[#66605F]">
            Checkout was not completed. You can return to your book order and try payment again.
          </p>
          <div className="mt-6">
            <Link
              href="/book-builder/checkout?retry=1"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-6 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]"
            >
              <ArrowLeft size={16} />
              <span>Back to Checkout</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

