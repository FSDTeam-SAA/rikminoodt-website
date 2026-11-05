"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AuthBrand({ className = "" }: { className?: string }) {
  const { t } = useLanguage();

  return (
    <div className={`flex justify-center ${className}`}>
      <Link
        href="/"
        aria-label={t.auth.homeAria}
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
      >
        <Image
          src="/images/rikLogo-transparent.png"
          alt="Boekerello"
          width={1600}
          height={427}
          priority
          className="h-auto w-[155px] object-contain sm:w-[180px]"
        />
      </Link>
    </div>
  );
}
