"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to send reset code.");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("reset_email", email);
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to send reset code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1160px] items-center gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
        {/* Left Side: Artwork Card */}
        <div className="flex w-full justify-center">
          <div className="relative aspect-[385/542] w-full max-w-[400px] rounded-xl bg-[#FFF8ED] sm:max-w-[440px] lg:max-w-none">
            <Image
              src="/images/auth_2.png"
              alt="Boekerello Magical Adventure"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              priority
              className="object-contain p-3 sm:p-5"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="mx-auto flex w-full max-w-[460px] flex-col justify-center">
          {/* Back to sign in */}
          <div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 font-sans text-xs text-[#2A2A2A] transition-colors hover:text-[#E88DA0]"
            >
              <ArrowLeft size={15} />
              <span>Back to sign In</span>
            </Link>
          </div>


          {/* Logo */}
          <div className="mt-8 flex justify-center">
            <Link href="/" aria-label="Boekerello Home">
              <Image
                src="/images/logo.png"
                alt="Boekerello"
                width={190}
                height={55}
                priority
                className="h-auto w-[155px] sm:w-[180px]"
              />
            </Link>
          </div>

          {/* Headings */}
          <div className="mt-7 text-center">
            <h1 className="font-crimson text-[30px] font-bold text-[#1E1E1E] sm:text-[34px]">
              Forgot Password?
            </h1>
            <p className="mx-auto mt-2 max-w-[360px] font-sans text-sm leading-relaxed text-[#5A6578]">
              Enter your email and we&apos;ll send you a code to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-[#252025]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-[10px] border border-[#F3C5CF] bg-white px-3.5 font-sans text-xs text-[#252025] outline-none placeholder:text-[#A0A8B4] transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 sm:text-sm"
              />
            </div>

            {errorMessage && (
              <p role="alert" className="font-sans text-xs text-[#B74760]">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#E88DA0] font-sans text-sm font-medium text-white shadow-[0_4px_14px_rgba(232,141,160,0.28)] transition hover:bg-[#DE778C] disabled:opacity-60"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{isLoading ? "Sending code..." : "Continue"}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
