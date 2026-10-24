"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ContactPage() {
  const { t } = useLanguage();
  const contact = t.contact || {
    title: "Contact Us",
    subheading: "Enter your details and send us a message, our team will get back to you soon.",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    email: "Email",
    emailPlaceholder: "Enter your email",
    message: "Message",
    messagePlaceholder: "Write your message",
    send: "Send",
    sending: "Sending...",
    successTitle: "Message Sent!",
    successMessage: "Thank you for reaching out. We will get back to you shortly.",
    sendAnother: "Send another message",
    errorRequired: "Please fill in all fields.",
    errorEmail: "Please enter a valid email address.",
  };

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
      setError(contact.errorRequired);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(contact.errorEmail);
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
    <main className="min-h-screen bg-[#FCF7F1] pb-20">
      {/* Hero Banner Section */}
      <section className="relative flex h-[58svh] min-h-[400px] w-full items-center justify-center overflow-hidden pt-16 text-center sm:min-h-[470px] sm:pt-20 lg:min-h-[520px]">
        {/* Background Image Banner */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cont_pri_img.png"
            alt="Hero background"
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          {/* Subtle gradient overlay to smoothly transition to page background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/65" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="font-crimson text-[38px] font-bold leading-none text-[#1E1E1E] sm:text-[44px] lg:text-[50px]">
            {contact.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-[#3F3A3E] sm:text-[18px]">
            {contact.subheading}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="container relative z-20 mx-auto -mt-[72px] px-4">
        <div className="mx-auto max-w-[920px] rounded-[11px] border border-[#F3A8B7] bg-[#FFFDFC] p-3.5 shadow-[0_10px_35px_rgba(232,141,160,0.08)] sm:p-3.5">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#18B56E]">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="mt-4 font-crimson text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                {contact.successTitle}
              </h2>
              <p className="mx-auto mt-2 max-w-md font-sans text-sm text-[#66605F]">
                {contact.successMessage}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl bg-[#E88DA0] px-8 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]"
              >
                {contact.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  {contact.fullName}
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={contact.fullNamePlaceholder}
                  className="h-9 w-full rounded-[9px] border border-[#F3A8B7] bg-white px-2.5 font-sans text-sm text-[#1E1E1E] outline-none placeholder:text-[#BBB0B5] transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-[#1E1E1E]">
                  {contact.email}
                </label>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={contact.emailPlaceholder}
                  className="h-9 w-full rounded-[9px] border border-[#F3A8B7] bg-white px-2.5 font-sans text-sm text-[#1E1E1E] outline-none placeholder:text-[#BBB0B5] transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-[#1E1E1E]">
                  {contact.message}
                </label>
                <textarea
                  required
                  disabled={loading}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={contact.messagePlaceholder}
                  className="min-h-[175px] w-full resize-none rounded-[9px] border border-[#F3A8B7] bg-white p-2.5 font-sans text-sm text-[#1E1E1E] outline-none placeholder:text-[#BBB0B5] transition focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[34px] min-w-[108px] items-center justify-center gap-2 rounded-[9px] bg-[#E88DA0] px-6 font-sans text-xs font-semibold text-white shadow-sm transition hover:bg-[#DD7893] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{contact.sending}</span>
                    </>
                  ) : (
                    <span>{contact.send}</span>
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
