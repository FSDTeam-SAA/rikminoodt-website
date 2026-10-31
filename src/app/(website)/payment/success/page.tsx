"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Home,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatGenerationError } from "../../book-builder/_components/generation-error";

type Book = {
  _id: string;
  status: string;
  paidAt?: string;
  stripeSessionId?: string;
  title?: string;
  generationError?: string;
  failureType?: "CONTENT_MODERATION" | "IMAGE_QUALITY" | "TIMEOUT" | "SERVER_ERROR";
  failureMessage?: string;
  coverImageUrl?: string;
  pages?: Array<{ pageNumber: number; text: string }>;
};

type PaymentLanguage = "en" | "nl" | "fr";

const ESTIMATED_BOOK_GENERATION_MS = 15 * 60 * 1000;
const INITIAL_GENERATION_PROGRESS = 5;
const MAX_SIMULATED_PROGRESS = 95;

const paymentCopy: Record<PaymentLanguage, {
  paymentSuccessful: string;
  confirmingPayment: string;
  confirmingDescription: string;
  bookReady: string;
  generationIssue: string;
  creatingBook: string;
  bookReference: string;
  viewBookStatus: string;
  editAndRetry: string;
  retryGeneration: string;
  changePhotoAndRetry: string;
  creationComplete: string;
  creationCompleteDescription: string;
  goToGeneratedBook: string;
  generationNeedsAttention: string;
  creatingMagicalBook: string;
  generationFailedDescription: string;
  generationDescription: string;
  waitingForPayment: string;
  addingFinalTouches: string;
  thisMayTakeAMoment: string;
  closeStatusHint: string;
}> = {
  en: {
    paymentSuccessful: "Payment successful", confirmingPayment: "Confirming your payment", confirmingDescription: "Please wait while we confirm your payment with the server.", bookReady: "Your personalised book is ready!", generationIssue: "Your payment is confirmed, but book generation encountered an issue.", creatingBook: "Your payment is confirmed. We’re creating your personalised storybook.", bookReference: "Book reference", viewBookStatus: "View book status", editAndRetry: "Edit Story & Retry", retryGeneration: "Retry Generation", changePhotoAndRetry: "Change Photo & Retry", creationComplete: "Book creation complete", creationCompleteDescription: "Your personalised book is ready to read whenever you are.", goToGeneratedBook: "Go to Generated Book", generationNeedsAttention: "Generation needs attention", creatingMagicalBook: "Creating your magical book", generationFailedDescription: "Your payment is confirmed, but we couldn’t finish the book. You can try again.", generationDescription: "We’re writing and illustrating your story. This window will close when your book is ready.", waitingForPayment: "We’re waiting for payment confirmation before starting your book.", addingFinalTouches: "Adding the final magical touches…", thisMayTakeAMoment: "This may take a moment.", closeStatusHint: "You can close this window and reopen the status on this page.",
  },
  nl: {
    paymentSuccessful: "Betaling geslaagd", confirmingPayment: "Je betaling wordt bevestigd", confirmingDescription: "Even geduld terwijl we je betaling met de server bevestigen.", bookReady: "Je persoonlijke boek is klaar!", generationIssue: "Je betaling is bevestigd, maar er is een probleem opgetreden bij het maken van het boek.", creatingBook: "Je betaling is bevestigd. We maken jouw persoonlijke verhalenboek.", bookReference: "Boekreferentie", viewBookStatus: "Bekijk boekstatus", editAndRetry: "Verhaal bewerken en opnieuw proberen", retryGeneration: "Opnieuw proberen", changePhotoAndRetry: "Foto wijzigen en opnieuw proberen", creationComplete: "Boek maken voltooid", creationCompleteDescription: "Je persoonlijke boek is klaar om te lezen wanneer jij dat wilt.", goToGeneratedBook: "Naar je gemaakte boek", generationNeedsAttention: "Voor het maken is actie nodig", creatingMagicalBook: "We maken jouw magische boek", generationFailedDescription: "Je betaling is bevestigd, maar we konden het boek niet afmaken. Je kunt het opnieuw proberen.", generationDescription: "We schrijven en illustreren jouw verhaal. Dit venster sluit wanneer je boek klaar is.", waitingForPayment: "We wachten op de betalingsbevestiging voordat we met je boek beginnen.", addingFinalTouches: "De laatste magische details worden toegevoegd…", thisMayTakeAMoment: "Dit kan even duren.", closeStatusHint: "Je kunt dit venster sluiten en de status op deze pagina opnieuw openen.",
  },
  fr: {
    paymentSuccessful: "Paiement réussi", confirmingPayment: "Confirmation de votre paiement", confirmingDescription: "Veuillez patienter pendant que nous confirmons votre paiement avec le serveur.", bookReady: "Votre livre personnalisé est prêt !", generationIssue: "Votre paiement est confirmé, mais un problème est survenu lors de la création du livre.", creatingBook: "Votre paiement est confirmé. Nous créons votre livre d’histoires personnalisé.", bookReference: "Référence du livre", viewBookStatus: "Voir le statut du livre", editAndRetry: "Modifier l’histoire et réessayer", retryGeneration: "Réessayer la création", changePhotoAndRetry: "Changer la photo et réessayer", creationComplete: "Création du livre terminée", creationCompleteDescription: "Votre livre personnalisé est prêt à être lu quand vous le souhaitez.", goToGeneratedBook: "Voir votre livre créé", generationNeedsAttention: "La création nécessite votre attention", creatingMagicalBook: "Création de votre livre magique", generationFailedDescription: "Votre paiement est confirmé, mais nous n’avons pas pu terminer le livre. Vous pouvez réessayer.", generationDescription: "Nous écrivons et illustrons votre histoire. Cette fenêtre se fermera lorsque votre livre sera prêt.", waitingForPayment: "Nous attendons la confirmation du paiement avant de commencer votre livre.", addingFinalTouches: "Ajout des dernières touches magiques…", thisMayTakeAMoment: "Cela peut prendre un instant.", closeStatusHint: "Vous pouvez fermer cette fenêtre et rouvrir le statut sur cette page.",
  },
};

/** Flow 1: Hardcopy / Print Order Success (No book generation, no generation modal) */
function HardcopyPaymentSuccess({ sessionId }: { sessionId: string | null }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("last_payment_type");
    }
  }, []);

  return (
    <main className="min-h-[75vh] bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:pt-[190px]">
      <section className="mx-auto max-w-xl rounded-3xl border border-[#f3dce2] bg-[#FEFAF4] p-6 text-center shadow-[0_12px_40px_rgba(80,40,50,0.08)] sm:p-10">
        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#18B56E] shadow-sm">
          <CheckCircle2 size={40} />
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] px-4 py-1 font-sans text-xs font-semibold text-[#18B56E]">
          <span className="size-2 rounded-full bg-[#18B56E]" />
          <span>Hardcopy Order Confirmed</span>
        </div>

        <h1 className="mt-4 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
          Hardcopy Payment Successful!
        </h1>

        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-[#66605F]">
          Thank you! Your hardcopy book payment has been received successfully. We are now preparing your order for printing and shipping.
        </p>

        {/* Order Details Card */}
        <div className="mt-6 rounded-2xl border border-[#F0E5D9] bg-white p-5 text-left shadow-sm">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#8A7982]">
            Order Information
          </h2>
          <div className="mt-3 divide-y divide-[#F6EFE9] font-sans text-xs text-[#514256]">
            {sessionId && (
              <div className="flex flex-col gap-1 py-2 sm:flex-row sm:justify-between">
                <span className="text-[#8A7982]">Order Reference:</span>
                <span className="break-all font-mono text-[11px] font-semibold text-[#1E1E1E]">
                  {sessionId}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-[#8A7982]">Order Type:</span>
              <span className="font-semibold text-[#1E1E1E]">Personalized Hardcover Storybook</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#8A7982]">Payment Status:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#18B56E]">
                <span className="size-1.5 rounded-full bg-[#18B56E]" />
                Paid • Processing for Print
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/setting/ordered-book"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-6 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]"
          >
            <BookOpen size={16} />
            <span>View Ordered Books</span>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E88DA0] bg-transparent px-6 font-sans text-sm font-semibold text-[#E88DA0] transition hover:bg-[#FDE9EE]"
          >
            <Home size={16} />
            <span>Return Home</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

/** Flow 2: Book Generation Payment Success (Shows generation modal & live progress) */
function BookGenerationPaymentSuccess({
  bookId,
  sessionId,
}: {
  bookId: string;
  sessionId: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { language } = useLanguage();
  const [book, setBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [pollVersion, setPollVersion] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const generationStartedAtRef = useRef<number | null>(null);
  const copy = paymentCopy[language as PaymentLanguage];

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      const token = localStorage.getItem("token") || session?.user?.accessToken;
      if (!token) {
        if (!stopped) setError("Please sign in to check your book status.");
        return;
      }
      try {
        const response = await fetch(
          `${getApiBaseUrl()}/books/${encodeURIComponent(bookId)}`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        );
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.data) {
          throw new Error(result?.message || "Unable to check your book status.");
        }
        if (stopped) return;
        const next = result.data as Book;
        if (next.stripeSessionId && next.stripeSessionId !== sessionId) {
          setError("This payment session does not match the book. Please contact support.");
          return;
        }
        setBook(next);
        setError("");
        if (next.status === "COMPLETED" && next.paidAt) return;
        if (next.status !== "FAILED" || !next.paidAt) {
          timer = setTimeout(poll, 4000);
        }
      } catch (err) {
        if (stopped) return;
        setError(err instanceof Error ? err.message : "Unable to check your book status.");
        timer = setTimeout(poll, 10000);
      }
    };

    void poll();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [bookId, sessionId, session?.user?.accessToken, pollVersion]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
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
      const response = await fetch(
        `${getApiBaseUrl()}/books/${encodeURIComponent(bookId)}/retry`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Unable to retry generation.");
      setBook(result.data);
      generationStartedAtRef.current = Date.now();
      setGenerationProgress(INITIAL_GENERATION_PROGRESS);
      setModalOpen(true);
      setPollVersion((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retry generation.");
    } finally {
      setRetrying(false);
    }
  };

  const redirectToWizard = () => {
    // The builder keeps its existing values in session storage. Its checkout
    // step recognizes this ID and submits the edited data to the retry API.
    sessionStorage.setItem("retry_book_id", bookId);
    router.push("/book-builder/InformationAboutCharacters");
  };

  const paid = Boolean(book?.paidAt);
  const completed = paid && book?.status === "COMPLETED";
  const failed = paid && book?.status === "FAILED";
  const failureType = book?.failureType;

  // The API reports only the final book status. Simulate a 15-minute journey,
  // then reserve 100% for the real completion signal.
  useEffect(() => {
    if (!paid) {
      generationStartedAtRef.current = null;
      setGenerationProgress(0);
      return;
    }
    if (failed) return;
    if (completed) {
      setGenerationProgress(100);
      // Let the completed bar be visible briefly, then reveal the localized
      // payment-success screen behind this modal.
      const closeTimer = window.setTimeout(() => setModalOpen(false), 1200);
      return () => window.clearTimeout(closeTimer);
    }

    if (!generationStartedAtRef.current) generationStartedAtRef.current = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - (generationStartedAtRef.current || Date.now());
      const simulatedProgress = Math.min(
        MAX_SIMULATED_PROGRESS,
        INITIAL_GENERATION_PROGRESS + Math.floor(
          (elapsed / ESTIMATED_BOOK_GENERATION_MS) * (MAX_SIMULATED_PROGRESS - INITIAL_GENERATION_PROGRESS),
        ),
      );
      setGenerationProgress((current) => Math.max(current, simulatedProgress));
    };

    updateProgress();
    const timer = window.setInterval(() => {
      updateProgress();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paid, failed, completed]);

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center bg-[radial-gradient(circle_at_top,_#FFF9F1,_#FEF6EC_52%,_#F8EEF5)] px-4 py-8 sm:px-8 sm:py-12">
      <section className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-[#f3dce2] bg-[#FEFAF4] p-6 text-center shadow-[0_16px_44px_rgba(80,40,50,0.1)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#FDE2E8]/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full bg-[#EDE5FB]/60 blur-3xl" />
        <div className="relative">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${
            paid ? "bg-[#E6F7ED] text-[#18B56E]" : "bg-[#FDE9EE] text-[#E88DA0]"
          }`}
        >
          {paid ? <CheckCircle2 size={32} /> : <Loader2 size={32} className="animate-spin" />}
        </div>
        <h1 className="mt-5 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
          {paid ? copy.paymentSuccessful : copy.confirmingPayment}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#66605F]">
          {!paid
            ? copy.confirmingDescription
            : completed
            ? copy.bookReady
            : failed
            ? copy.generationIssue
            : copy.creatingBook}
        </p>
        {failed && (
          <div className="mt-3">
            <p className="text-sm text-[#B74760]">
              {formatGenerationError(book?.generationError || book?.failureMessage)}
            </p>
            {failureType && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#856F77]">
                Failure type: {failureType.replaceAll("_", " ")}
              </p>
            )}
          </div>
        )}
        {bookId && (
          <p className="mt-3 break-all text-xs text-[#8A7982]">{copy.bookReference}: {bookId}</p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-[#B74760]">
            {formatGenerationError(error)}
          </p>
        )}
        {!completed && !modalOpen && (
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 min-h-11 rounded-xl bg-[#E88DA0] px-6 text-sm font-semibold text-white transition hover:bg-[#DD7893]"
          >
            {copy.viewBookStatus}
          </button>
        )}
        {failed && failureType === "CONTENT_MODERATION" && (
          <button
            onClick={redirectToWizard}
            className="mt-6 min-h-11 rounded-xl bg-[#E88DA0] px-6 text-sm font-semibold text-white"
          >
            {copy.editAndRetry}
          </button>
        )}
        {failed && failureType === "IMAGE_QUALITY" && (
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              onClick={retry}
              disabled={retrying}
              className="min-h-11 rounded-xl bg-[#E88DA0] px-6 text-sm font-semibold text-white disabled:opacity-60"
            >
              {retrying ? `${copy.retryGeneration}…` : copy.retryGeneration}
            </button>
            <button
              onClick={redirectToWizard}
              className="min-h-11 rounded-xl border border-[#E88DA0] bg-white px-6 text-sm font-semibold text-[#C75D78] transition hover:bg-[#FFF3F5]"
            >
              {copy.changePhotoAndRetry}
            </button>
          </div>
        )}
        {failed && failureType !== "CONTENT_MODERATION" && failureType !== "IMAGE_QUALITY" && (
          <button
            onClick={retry}
            disabled={retrying}
            className="ml-3 mt-6 min-h-11 rounded-xl bg-[#E88DA0] px-6 text-sm font-semibold text-white disabled:opacity-60"
          >
            {retrying ? `${copy.retryGeneration}…` : copy.retryGeneration}
          </button>
        )}
        {completed && (
          <div className="mt-6 rounded-2xl border border-[#D8EFDF] bg-white/75 p-5 sm:p-6">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#E6F7ED] text-[#18B56E]">
              <CheckCircle2 size={22} />
            </div>
            <h2 className="mt-3 font-crimson text-2xl font-semibold text-[#514256]">
              {copy.creationComplete}
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-[#66605F]">
              {copy.creationCompleteDescription}
            </p>
            <Link
              href="/setting/generated-books"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-6 font-sans text-sm font-semibold text-white shadow-[0_5px_15px_rgba(232,141,160,0.3)] transition hover:bg-[#DD7893] sm:w-auto"
            >
              <BookOpen size={17} />
              {copy.goToGeneratedBook}
            </Link>
          </div>
        )}
        </div>
      </section>

      {/* Generation Status Modal - ONLY for Book Generation flow */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#312736]/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="generation-modal-title"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#F3A8B7]/40 bg-[#FEFAF4] p-7 text-center shadow-[0_20px_50px_rgba(50,30,40,0.25)] sm:p-9">
            <button
              type="button"
              aria-label="Close status"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-[#806f79] hover:bg-[#f9e8ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf]"
            >
              <X size={20} />
            </button>
            <div
              className={`mx-auto flex size-20 items-center justify-center rounded-2xl ${
                failed
                  ? "bg-[#FFF0F2] text-[#B74760]"
                  : completed
                    ? "bg-[#E6F7ED] text-[#18B56E]"
                    : "bg-[#FDE9EE] text-[#E88DA0]"
              }`}
            >
              {failed ? (
                <AlertCircle size={34} />
              ) : completed ? (
                <CheckCircle2 size={34} />
              ) : (
                <Sparkles size={34} className="animate-pulse" />
              )}
            </div>
            <h2
              id="generation-modal-title"
              className="mt-5 font-crimson text-3xl font-semibold text-[#514256]"
            >
              {failed
                ? copy.generationNeedsAttention
                : completed
                  ? copy.bookReady
                : paid
                ? copy.creatingMagicalBook
                : copy.confirmingPayment}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#70636b]">
              {failed
                ? copy.generationFailedDescription
                : completed
                  ? copy.creationCompleteDescription
                : paid
                ? copy.generationDescription
                : copy.waitingForPayment}
            </p>
            {failed && (
              <div className="mt-3">
                <p className="text-sm text-[#B74760]">
                  {formatGenerationError(book?.generationError || book?.failureMessage)}
                </p>
                {failureType && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#856F77]">
                    Failure type: {failureType.replaceAll("_", " ")}
                  </p>
                )}
              </div>
            )}
            {paid && !failed && (
              <div className="mt-7 flex flex-col items-center text-center">
                <div className="w-full rounded-2xl border border-[#F1D8E0] bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between font-sans text-xs font-semibold text-[#71616A]">
                    <span>{completed ? copy.creationComplete : copy.addingFinalTouches}</span>
                    <span className={completed ? "text-[#18B56E]" : "text-[#D56A88]"}>{generationProgress}%</span>
                  </div>
                  <div
                    className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#F6DFE6]"
                    role="progressbar"
                    aria-label="Book generation progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={generationProgress}
                  >
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${
                        completed
                          ? "from-[#32B978] via-[#4FCB8D] to-[#78D9A7]"
                          : "from-[#F48FB1] via-[#E88DA0] to-[#FC8A43]"
                      }`}
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className={`mt-3 text-xs font-medium ${completed ? "text-[#188856]" : "text-[#9A8B93]"}`}>
                    {completed ? copy.creationCompleteDescription : copy.thisMayTakeAMoment}
                  </p>
                </div>
              </div>
            )}
            {!paid && !failed && (
              <div className="mt-7 flex flex-col items-center text-center">
                <Loader2 size={22} className="animate-spin text-[#9C81BE]" />
                <p className="mt-3 text-xs text-[#A09199]">{copy.thisMayTakeAMoment}</p>
              </div>
            )}
            {error && (
              <p role="alert" className="mt-4 text-xs text-[#B74760]">
                {formatGenerationError(error)}
              </p>
            )}
            {failed && failureType === "CONTENT_MODERATION" && (
              <button
                onClick={redirectToWizard}
                className="mt-5 min-h-11 w-full rounded-xl bg-[#E88DA0] font-semibold text-white"
              >
                {copy.editAndRetry}
              </button>
            )}
            {failed && failureType === "IMAGE_QUALITY" && (
              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={retry}
                  disabled={retrying}
                  className="min-h-11 w-full rounded-xl bg-[#E88DA0] font-semibold text-white disabled:opacity-60"
                >
                  {retrying ? `${copy.retryGeneration}…` : copy.retryGeneration}
                </button>
                <button
                  onClick={redirectToWizard}
                  className="min-h-11 w-full rounded-xl border border-[#E88DA0] bg-white font-semibold text-[#C75D78] transition hover:bg-[#FFF3F5]"
                >
                  {copy.changePhotoAndRetry}
                </button>
              </div>
            )}
            {failed && failureType !== "CONTENT_MODERATION" && failureType !== "IMAGE_QUALITY" && (
              <button
                onClick={retry}
                disabled={retrying}
                className="mt-5 min-h-11 w-full rounded-xl bg-[#E88DA0] font-semibold text-white disabled:opacity-60"
              >
                {retrying ? `${copy.retryGeneration}…` : copy.retryGeneration}
              </button>
            )}
            <p className="mt-5 text-xs text-[#95858e]">
              {copy.closeStatusHint}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function PaymentSuccessContent() {
  const params = useSearchParams();
  const bookId = params.get("book_id");
  const sessionId = params.get("session_id");

  // Flow 1: If session_id exists and NO book_id (or type=print), this is strictly hardcopy order
  const isPrintOrder = Boolean(
    sessionId &&
      (!bookId ||
        params.get("type") === "print" ||
        (typeof window !== "undefined" &&
          sessionStorage.getItem("last_payment_type") === "print" &&
          !bookId))
  );

  if (isPrintOrder) {
    return <HardcopyPaymentSuccess sessionId={sessionId} />;
  }

  // Flow 2: If book_id exists, this is strictly book generation flow
  if (bookId && sessionId) {
    return <BookGenerationPaymentSuccess bookId={bookId} sessionId={sessionId} />;
  }

  // Fallback: Missing parameters
  return (
    <main className="min-h-[70vh] bg-[#FEF6EC] px-4 pb-16 pt-[120px] sm:px-8 sm:pt-[150px] lg:pt-[190px]">
      <section className="mx-auto max-w-md rounded-3xl border border-[#f3dce2] bg-[#FEFAF4] p-8 text-center shadow-[0_12px_40px_rgba(80,40,50,0.08)]">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#FFF0F2] text-[#B74760]">
          <AlertCircle size={32} />
        </div>
        <h1 className="mt-5 font-crimson text-2xl font-bold text-[#1E1E1E]">
          Payment Details Missing
        </h1>
        <p className="mt-2 font-sans text-sm text-[#66605F]">
          Payment details could not be found. If you completed payment, please check your email confirmation or contact support.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#E88DA0] px-6 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]"
          >
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] bg-[#FEF6EC] p-16 text-center font-sans text-sm text-[#66605F]">
          Loading order status…
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
