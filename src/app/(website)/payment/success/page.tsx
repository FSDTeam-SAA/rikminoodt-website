"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import { formatGenerationError } from "../../book-builder/_components/generation-error";

type Book = { _id: string; status: string; paidAt?: string; stripeSessionId?: string; title?: string; generationError?: string; failureMessage?: string; pages?: Array<{ pageNumber: number; text: string }> };

function PaymentSuccessContent() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const bookId = params.get("book_id");
  const sessionId = params.get("session_id");
  const [book, setBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [pollVersion, setPollVersion] = useState(0);

  useEffect(() => {
    if (!bookId || !sessionId) { setError("Payment details are missing. Please contact support with your payment confirmation."); return; }
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      const token = localStorage.getItem("token") || session?.user?.accessToken;
      if (!token) { if (!stopped) setError("Please sign in to check your book status."); return; }
      try {
        const response = await fetch(`${getApiBaseUrl()}/books/${encodeURIComponent(bookId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.data) throw new Error(result?.message || "Unable to check your book status.");
        if (stopped) return;
        const next = result.data as Book;
        if (next.stripeSessionId !== sessionId) { setError("This payment session does not match the book. Please contact support."); return; }
        setBook(next);
        setError("");
        if (next.status === "COMPLETED" && next.paidAt) { setModalOpen(false); return; }
        if (next.status !== "FAILED" || !next.paidAt) timer = setTimeout(poll, 4000);
      } catch (err) {
        if (stopped) return;
        setError(err instanceof Error ? err.message : "Unable to check your book status.");
        timer = setTimeout(poll, 10000);
      }
    };
    void poll();
    return () => { stopped = true; if (timer) clearTimeout(timer); };
  }, [bookId, sessionId, session?.user?.accessToken, pollVersion]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen]);

  const retry = async () => {
    if (!bookId || !book?.paidAt || book.status !== "FAILED" || retrying) return;
    setRetrying(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || session?.user?.accessToken;
      if (!token) throw new Error("Please sign in to retry generation.");
      const response = await fetch(`${getApiBaseUrl()}/books/${encodeURIComponent(bookId)}/retry`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Unable to retry generation.");
      setBook(result.data);
      setModalOpen(true);
      setPollVersion((value) => value + 1);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to retry generation."); }
    finally { setRetrying(false); }
  };
  const paid = Boolean(book?.paidAt);
  const completed = paid && book?.status === "COMPLETED";
  const failed = paid && book?.status === "FAILED";

  return <main className="min-h-[70vh] bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:pt-[190px]">
    <section className="mx-auto max-w-2xl rounded-3xl border border-[#f3dce2] bg-[#FEFAF4] p-6 text-center shadow-[0_12px_40px_rgba(80,40,50,0.08)] sm:p-10">
      <div className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${paid ? "bg-[#E6F7ED] text-[#18B56E]" : "bg-[#FDE9EE] text-[#E88DA0]"}`}>{paid ? <CheckCircle2 size={32} /> : <Loader2 size={32} className="animate-spin" />}</div>
      <h1 className="mt-5 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">{paid ? "Payment successful" : "Confirming your payment"}</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#66605F]">{!paid ? "Please wait while we confirm your payment with the server." : completed ? "Your personalised book is ready!" : failed ? "Your payment is confirmed, but book generation encountered an issue." : "Your payment is confirmed. We’re creating your personalised storybook."}</p>
      {failed && <p className="mt-3 text-sm text-[#B74760]">{formatGenerationError(book?.generationError || book?.failureMessage)}</p>}
      {bookId && <p className="mt-3 break-all text-xs text-[#8A7982]">Book reference: {bookId}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-[#B74760]">{formatGenerationError(error)}</p>}
      {!completed && !modalOpen && <button onClick={() => setModalOpen(true)} className="mt-6 min-h-11 rounded-xl bg-[#E88DA0] px-6 text-sm font-semibold text-white">View book status</button>}
      {failed && <button onClick={retry} disabled={retrying} className="mt-6 min-h-11 rounded-xl bg-[#E88DA0] px-6 text-sm font-semibold text-white disabled:opacity-60">{retrying ? "Retrying…" : "Retry generation"}</button>}
      {completed && <div className="mt-7 rounded-2xl bg-[#FBF3EA] p-5 text-left"><h2 className="font-crimson text-3xl text-[#514256]">{book?.title || "Your storybook"}</h2>{book?.pages?.map((page) => <article key={page.pageNumber} className="mt-5"><h3 className="text-sm font-bold text-[#a34f6d]">Page {page.pageNumber}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#514256]">{page.text}</p></article>)}</div>}
      <p className="mt-7"><Link href="/" className="text-sm text-[#a34f6d] underline">Return home</Link></p>
    </section>
    {modalOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#312736]/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="generation-modal-title">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#F3A8B7]/40 bg-[#FEFAF4] p-7 text-center shadow-[0_20px_50px_rgba(50,30,40,0.25)] sm:p-9">
        <button type="button" aria-label="Close status" onClick={() => setModalOpen(false)} className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-[#806f79] hover:bg-[#f9e8ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf]"><X size={20} /></button>
        <div className={`mx-auto flex size-20 items-center justify-center rounded-2xl ${failed ? "bg-[#FFF0F2] text-[#B74760]" : "bg-[#FDE9EE] text-[#E88DA0]"}`}>{failed ? <AlertCircle size={34} /> : <Sparkles size={34} className="animate-pulse" />}</div>
        <h2 id="generation-modal-title" className="mt-5 font-crimson text-3xl font-semibold text-[#514256]">{failed ? "Generation needs attention" : paid ? "Creating your magical book" : "Confirming your payment"}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#70636b]">{failed ? "Your payment is confirmed, but we couldn’t finish the book. You can try again." : paid ? "We’re writing and illustrating your story. This window will close when your book is ready." : "We’re waiting for payment confirmation before starting your book."}</p>
        {failed && <p className="mt-3 text-sm text-[#B74760]">{formatGenerationError(book?.generationError || book?.failureMessage)}</p>}
        {!failed && <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#f4dce3]" aria-label="Checking status"><div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#e88da0] to-[#9c81be]" /></div>}
        {error && <p role="alert" className="mt-4 text-xs text-[#B74760]">{formatGenerationError(error)}</p>}
        {failed && <button onClick={retry} disabled={retrying} className="mt-5 min-h-11 w-full rounded-xl bg-[#E88DA0] font-semibold text-white disabled:opacity-60">{retrying ? "Retrying…" : "Retry generation"}</button>}
        <p className="mt-5 text-xs text-[#95858e]">You can close this window and reopen the status on this page.</p>
      </div>
    </div>}
  </main>;
}

export default function PaymentSuccessPage() {
  return <Suspense fallback={<main className="min-h-[60vh] bg-[#FEF6EC] p-16 text-center">Loading your order…</main>}><PaymentSuccessContent /></Suspense>;
}
