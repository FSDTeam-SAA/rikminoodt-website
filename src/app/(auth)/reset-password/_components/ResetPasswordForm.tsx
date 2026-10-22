"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    } else if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("reset_email");
      if (stored) setEmail(stored);
    }
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || "user@example.com", newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to reset password.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to reset password. Please try again."
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
          <div className="relative aspect-[385/542] w-full max-w-[400px] rounded-xl bg-[#F5F1FF] sm:max-w-[440px] lg:max-w-none">
            <Image
              src="/images/auth_4.png"
              alt="Boekerello Underwater Adventure"
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
              Reset Password?
            </h1>
            <p className="mx-auto mt-2 max-w-[360px] font-sans text-sm leading-relaxed text-[#5A6578]">
              Please enter a new password for your account. Use a strong password to keep your account secure.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {/* New Password */}
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-[#252025]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder=""
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-[10px] border border-[#F3C5CF] bg-white px-3.5 pr-10 font-sans text-xs text-[#252025] outline-none transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 sm:text-sm"
                />
                {!newPassword && (
                  <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-[calc(50%+2px)] -translate-y-1/2 font-sans text-xs text-[#A0A8B4] sm:text-sm">
                    ****************
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B4] transition hover:text-[#5A6578]"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-[#252025]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-[10px] border border-[#F3C5CF] bg-white px-3.5 pr-10 font-sans text-xs text-[#252025] outline-none transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 sm:text-sm"
                />
                {!confirmPassword && (
                  <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-[calc(50%+2px)] -translate-y-1/2 font-sans text-xs text-[#A0A8B4] sm:text-sm">
                    ****************
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B4] transition hover:text-[#5A6578]"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isSuccess && (
              <div className="flex items-center gap-2 rounded-[10px] bg-[#E6F7ED] p-3 text-xs font-medium text-[#18B56E]">
                <CheckCircle2 size={16} />
                <span>Password changed successfully! Redirecting to login...</span>
              </div>
            )}

            {errorMessage && (
              <p role="alert" className="pt-0.5 font-sans text-xs text-[#B74760]">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#E88DA0] font-sans text-sm font-medium text-white shadow-[0_4px_14px_rgba(232,141,160,0.28)] transition hover:bg-[#DE778C] disabled:opacity-60"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{isLoading ? "Updating..." : "Change Password"}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
