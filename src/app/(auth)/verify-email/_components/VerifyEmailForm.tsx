"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState("you@gmail.com");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    } else if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("reset_email");
      if (stored) setEmail(stored);
    }
  }, [emailParam]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMessage("");
    setMessage("");

    try {
      const apiBase = getApiBaseUrl();
      await fetch(`${apiBase}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMessage("A fresh verification code has been sent!");
    } catch {
      setMessage("A fresh verification code has been sent!");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setMessage("");

    const code = otp.join("");
    if (code.length < 6) {
      setErrorMessage("Please enter all 6 digits of the code.");
      return;
    }

    setIsLoading(true);

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Invalid verification code.");
      }

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to verify code. Please try again."
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
              src="/images/auth_3.png"
              alt="Boekerello Storybook Adventure"
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
              Verify your email
            </h1>
            <p className="mx-auto mt-2 max-w-[360px] font-sans text-sm leading-relaxed text-[#5A6578]">
              we sent a 6-digit code to {email}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-6">
            {/* 6 OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="size-11 rounded-[12px] border border-transparent bg-[#EEF3FA] text-center font-sans text-lg font-semibold text-[#1E1E1E] outline-none transition focus:border-[#E88DA0] focus:bg-white focus:ring-2 focus:ring-[#E88DA0]/20 sm:size-12"
                />
              ))}
            </div>

            {/* Resend Code Prompt */}
            <div className="text-center font-sans text-xs text-[#5A6578]">
              Didn&apos;t receive it ?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-[#E88DA0] transition hover:underline disabled:opacity-60"
              >
                {isResending ? "Resending..." : "Resend code"}
              </button>
            </div>

            {message && (
              <p role="status" className="text-center font-sans text-xs font-medium text-[#18B56E]">
                {message}
              </p>
            )}

            {errorMessage && (
              <p role="alert" className="text-center font-sans text-xs text-[#B74760]">
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
              <span>{isLoading ? "Verifying..." : "Verify"}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
