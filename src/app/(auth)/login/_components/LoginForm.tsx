"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("boekerello_remembered_email");
    const shouldRemember = localStorage.getItem("boekerello_session_mode") === "persistent";

    if (shouldRemember && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("boekerello_session_mode", "persistent");
        localStorage.setItem("boekerello_remembered_email", email.trim());
        sessionStorage.removeItem("boekerello_auth_session");
      } else {
        localStorage.setItem("boekerello_session_mode", "session");
        localStorage.removeItem("boekerello_remembered_email");
        sessionStorage.setItem("boekerello_auth_session", "active");
      }

      // Also sync accessToken to localStorage for direct REST API calls
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData?.user?.accessToken) {
          localStorage.setItem("token", sessionData.user.accessToken);
          if (sessionData.user.refreshToken) {
            localStorage.setItem("refreshToken", sessionData.user.refreshToken);
          }
        }
      } catch (e) {
        console.error("Session sync error:", e);
      }

      router.push("/setting");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to log in. Please check your credentials."
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
          <div className="relative aspect-[385/542] w-full max-w-[400px] rounded-xl bg-[#F7FBEF] sm:max-w-[440px] lg:max-w-none">
            <Image
              src="/images/auth_1.png"
              alt="Boekerello Space Adventure"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              priority
              className="object-contain p-3 sm:p-5"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="mx-auto flex w-full max-w-[460px] flex-col justify-center">
          {/* Back button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs text-[#2A2A2A] transition-colors hover:text-[#E88DA0]"
            >
              <ArrowLeft size={15} />
              <span>Back to sign In</span>
            </Link>
          </div>

          {/* Logo */}
          <div className="mt-6 flex justify-center sm:mt-7">
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
          <div className="mt-6 text-center">
            <h1 className="font-crimson text-[30px] font-bold text-[#1E1E1E] sm:text-[34px]">
              Welcome back
            </h1>
            <p className="mx-auto mt-2 max-w-[360px] font-sans text-sm leading-relaxed text-[#5A6578]">
              Please enter your email & password to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-7">
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

            {/* Password Field */}
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-[#252025]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-[10px] border border-[#F3C5CF] bg-white px-3.5 pr-10 font-sans text-xs text-[#252025] outline-none transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 sm:text-sm"
                />
                {!password && (
                  <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-[calc(50%+2px)] -translate-y-1/2 font-sans text-xs text-[#A0A8B4] sm:text-sm">
                    ****************
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B4] transition hover:text-[#5A6578]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-3.5 rounded border-[#F3C5CF] text-[#E88DA0] focus:ring-[#E88DA0]"
                />
                <span className="font-sans text-xs text-[#5A6578]">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-sans text-xs font-normal text-[#E88DA0] transition hover:underline"
              >
                Forgot Password
              </Link>
            </div>

            {errorMessage && (
              <p role="alert" className="pt-0.5 font-sans text-xs text-[#B74760]">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#E88DA0] font-sans text-sm font-medium text-white shadow-[0_4px_14px_rgba(232,141,160,0.28)] transition hover:bg-[#DE778C] disabled:opacity-60"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{isLoading ? "Signing in..." : "Log in"}</span>
            </button>

            {/* Footer */}
            <p className="pt-1.5 text-center font-sans text-xs text-[#5A6578]">
              Don&apos;t have an account?{" "}
              <Link
                href="/book-builder"
                className="font-medium text-[#E88DA0] transition hover:underline"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
