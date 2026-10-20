import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-[#FEFAF4] px-4 text-center"
    >
      <div className="relative mb-6">
        <Image
          src="/images/logo.png"
          alt="Bookerello"
          width={180}
          height={50}
          priority
          className="h-auto w-36 sm:w-44"
        />
      </div>

      <div className="flex items-center gap-2.5 font-sans text-sm font-medium text-[#7A6B75]">
        <Loader2 size={20} className="animate-spin text-[#E88DA0]" />
        <span>Loading magical stories…</span>
      </div>

      <span className="sr-only">Please wait while the content loads.</span>
    </div>
  );
}
