"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import PageHero from "../../_components/PageHero";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFullName("");
      setEmail("");
      setMessage("");
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[#FEFAF4] pb-20">
      <PageHero
        title="Contact Us"
        description="Enter your details and send us a message, our team will get back to you soon."
        imageAlt="Contact us banner"
      />

      {/* Form Section */}
      <section className="container mx-auto mt-2 px-4 sm:mt-6">
        <div className="mx-auto max-w-[760px] rounded-[24px] border border-[#F3A8B7] bg-[#FFFDFC] p-6 shadow-[0_10px_35px_rgba(232,141,160,0.08)] sm:p-10">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#18B56E]">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="mt-4 font-crimson text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                Message Sent!
              </h2>
              <p className="mx-auto mt-2 max-w-md font-sans text-sm text-[#66605F]">
                Thank you for contacting us! We have received your message and will get back to you as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl bg-[#E88DA0] px-8 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm"
                >
                  {error}
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-[#1E1E1E]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#F3A8B7] bg-white px-4 py-3 font-sans text-sm text-[#1E1E1E] outline-none placeholder:text-[#BBB0B5] transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-[#1E1E1E]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#F3A8B7] bg-white px-4 py-3 font-sans text-sm text-[#1E1E1E] outline-none placeholder:text-[#BBB0B5] transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-[#1E1E1E]">
                  Message
                </label>
                <textarea
                  required
                  disabled={loading}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message"
                  className="min-h-[220px] w-full resize-none rounded-xl border border-[#F3A8B7] bg-white p-4 font-sans text-sm text-[#1E1E1E] outline-none placeholder:text-[#BBB0B5] transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-10 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition hover:bg-[#DD7893] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

