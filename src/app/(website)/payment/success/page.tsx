"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Download,
  Home,
  Loader2,
  Truck,
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
  downloadBook: string;
  generationNeedsAttention: string;
  creatingMagicalBook: string;
  generationFailedDescription: string;
  generationDescription: string;
  waitingForPayment: string;
  addingFinalTouches: string;
  thisMayTakeAMoment: string;
  closeStatusHint: string;
  emailPdfNotification: string;
}> = {
  en: {
    paymentSuccessful: "Payment successful", confirmingPayment: "Confirming your payment", confirmingDescription: "Please wait while we confirm your payment with the server.", bookReady: "Your personalised book is ready!", generationIssue: "Your payment is confirmed, but book generation encountered an issue.", creatingBook: "Your payment is confirmed. We’re creating your personalised storybook.", bookReference: "Book reference", viewBookStatus: "View book status", editAndRetry: "Edit Story & Retry", retryGeneration: "Retry Generation", changePhotoAndRetry: "Change Photo & Retry", creationComplete: "Book creation complete", creationCompleteDescription: "Your personalised book is ready to read whenever you are.", goToGeneratedBook: "Go to My Book", downloadBook: "Download My Book", generationNeedsAttention: "Generation needs attention", creatingMagicalBook: "We're creating your magical book", generationFailedDescription: "Your payment is confirmed, but we couldn’t finish the book. You can try again.", generationDescription: "We’re writing and illustrating your story. This window will close once your book is ready.", waitingForPayment: "We’re waiting for payment confirmation before starting your book.", addingFinalTouches: "Adding the final magical touches...", thisMayTakeAMoment: "This may take a few minutes.", closeStatusHint: "You can close this window and check the status on this page later.", emailPdfNotification: "You'll receive an email as soon as the PDF is ready.",
  },
  nl: {
    paymentSuccessful: "Betaling geslaagd", confirmingPayment: "Je betaling wordt bevestigd", confirmingDescription: "Even geduld terwijl we je betaling met de server bevestigen.", bookReady: "Je persoonlijke boek is klaar!", generationIssue: "Je betaling is bevestigd, maar er is een probleem opgetreden bij het maken van het boek.", creatingBook: "Je betaling is bevestigd. We maken jouw persoonlijke verhalenboek.", bookReference: "Boekreferentie", viewBookStatus: "Bekijk boekstatus", editAndRetry: "Verhaal bewerken en opnieuw proberen", retryGeneration: "Opnieuw proberen", changePhotoAndRetry: "Foto wijzigen en opnieuw proberen", creationComplete: "Je boek is compleet!", creationCompleteDescription: "Je persoonlijke boek is klaar om te lezen wanneer jij dat wilt.", goToGeneratedBook: "Naar mijn boek", downloadBook: "Download mijn boek", generationNeedsAttention: "Voor het maken is actie nodig", creatingMagicalBook: "We maken jouw magische boek", generationFailedDescription: "Je betaling is bevestigd, maar we konden het boek niet afmaken. Je kunt het opnieuw proberen.", generationDescription: "We schrijven en illustreren jouw verhaal. Dit venster sluit wanneer je boek klaar is.", waitingForPayment: "We wachten op de betalingsbevestiging voordat we met je boek beginnen.", addingFinalTouches: "De laatste magische details worden toegevoegd...", thisMayTakeAMoment: "Dit kan even duren.", closeStatusHint: "Je kunt dit venster sluiten en de status op deze pagina opnieuw openen.", emailPdfNotification: "Je ontvangt een e-mail zodra de PDF klaar is.",
  },
  fr: {
    paymentSuccessful: "Paiement réussi", confirmingPayment: "Confirmation de votre paiement", confirmingDescription: "Veuillez patienter pendant que nous confirmons votre paiement avec le serveur.", bookReady: "Votre livre personnalisé est prêt !", generationIssue: "Votre paiement est confirmé, mais un problème est survenu lors de la création du livre.", creatingBook: "Votre paiement est confirmé. Nous créons votre livre d’histoires personnalisé.", bookReference: "Référence du livre", viewBookStatus: "Voir le statut du livre", editAndRetry: "Modifier l’histoire et réessayer", retryGeneration: "Réessayer la création", changePhotoAndRetry: "Changer la photo et réessayer", creationComplete: "Votre livre est terminé !", creationCompleteDescription: "Votre livre personnalisé est prêt à être lu quand vous le souhaitez.", goToGeneratedBook: "Voir mon livre", downloadBook: "Télécharger mon livre", generationNeedsAttention: "La création nécessite votre attention", creatingMagicalBook: "Nous créons votre livre magique", generationFailedDescription: "Votre paiement est confirmé, mais nous n’avons pas pu terminer le livre. Vous pouvez réessayer.", generationDescription: "Nous écrivons et illustrons votre histoire. Cette fenêtre se fermera lorsque votre livre sera prêt.", waitingForPayment: "Nous attendons la confirmation du paiement avant de commencer votre livre.", addingFinalTouches: "Ajout des dernières touches magiques...", thisMayTakeAMoment: "Cela peut prendre quelques minutes.", closeStatusHint: "Vous pouvez fermer cette fenêtre et vérifier le statut sur cette page plus tard.", emailPdfNotification: "Vous recevrez un e-mail dès que le PDF sera prêt.",
  },
};

const hardcopyCopy = {
  nl: {
    confirmedBadge: "Hardcopy bestelling bevestigd",
    title: "Betaling hardcover geslaagd!",
    description: "Bedankt! De betaling voor je fysieke boek is succesvol ontvangen. We maken je bestelling nu klaar voor druk en verzending.",
    orderInfo: "Bestelinformatie",
    orderRef: "Bestelreferentie:",
    orderType: "Besteltype:",
    orderTypeValue: "Gepersonaliseerd Hardcover Verhalenboek",
    paymentStatus: "Betalingsstatus:",
    paymentStatusValue: "Betaald • In voorbereiding voor druk",
    deliveryNotice: "Je ontvangt een e-mail met de verzendstatus zodra je boek onderweg is.",
    viewOrderedBooks: "Bekijk bestelde boeken",
    returnHome: "Terug naar startpagina",
  },
  en: {
    confirmedBadge: "Hardcopy Order Confirmed",
    title: "Hardcopy Payment Successful!",
    description: "Thank you! Your hardcopy book payment has been received successfully. We are now preparing your order for printing and shipping.",
    orderInfo: "Order Information",
    orderRef: "Order Reference:",
    orderType: "Order Type:",
    orderTypeValue: "Personalized Hardcover Storybook",
    paymentStatus: "Payment Status:",
    paymentStatusValue: "Paid • Processing for Print",
    deliveryNotice: "You will receive an email with the shipping status as soon as your book is on its way.",
    viewOrderedBooks: "View Ordered Books",
    returnHome: "Return Home",
  },
  fr: {
    confirmedBadge: "Commande de livre relié confirmée",
    title: "Paiement du livre relié réussi !",
    description: "Merci ! Le paiement de votre livre relié a été reçu avec succès. Nous préparons maintenant votre commande pour l'impression et l'expédition.",
    orderInfo: "Informations sur la commande",
    orderRef: "Référence de la commande :",
    orderType: "Type de commande :",
    orderTypeValue: "Livre d'histoires personnalisé relié",
    paymentStatus: "Statut du paiement :",
    paymentStatusValue: "Payé • En cours de préparation pour impression",
    deliveryNotice: "Vous recevrez un e-mail avec le statut de livraison dès que votre livre sera en route.",
    viewOrderedBooks: "Voir les livres commandés",
    returnHome: "Retour à l'accueil",
  },
};

/** Flow 1: Hardcopy / Print Order Success (No book generation, no generation modal) */
function HardcopyPaymentSuccess({ sessionId }: { sessionId: string | null }) {
  const { language } = useLanguage();
  const copy = hardcopyCopy[language as PaymentLanguage] || hardcopyCopy.nl;

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("last_payment_type");
    }
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-116px)] items-center bg-[radial-gradient(circle_at_top,_#FFFDF9,_#FEF6EC_58%,_#F8EEF5)] px-3 py-10 sm:px-6 sm:py-12">
      <section className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-[38px] border border-white/90 bg-[#FFFDFB] px-5 py-8 text-center shadow-[0_20px_55px_rgba(85,51,70,0.16)] sm:px-10 sm:py-10">
        <ModalConfettiDecorations />

        <div className="relative z-10">
          <Image
            src="/images/payment-success-check.png"
            alt=""
            width={1536}
            height={1024}
            priority
            className="mx-auto -my-5 h-[106px] w-[145px] object-contain sm:h-[120px] sm:w-[165px]"
          />

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] px-4 py-1.5 font-sans text-xs font-semibold text-[#18B56E] sm:text-sm">
          <span className="size-2 rounded-full bg-[#18B56E]" />
          <span>{copy.confirmedBadge}</span>
          </div>

          <h1 className="mt-4 font-sans text-[29px] font-bold leading-tight tracking-tight text-[#162035] sm:text-[39px]">
            {copy.title}
          </h1>

          <p className="mx-auto mt-2 max-w-[590px] font-sans text-sm leading-snug text-[#626477] sm:text-[18px]">
            {copy.description}
          </p>

          <Image
            src="/images/payment-success-book-hero.png"
            alt="A magical rocket rising from an open storybook"
            width={1536}
            height={1024}
            priority
            className="mx-auto my-3 h-[145px] w-full max-w-[360px] object-contain sm:my-4 sm:h-[165px] sm:max-w-[420px]"
          />

          <div className="mt-2 rounded-[22px] border border-[#F5D6E1] bg-white/90 px-5 py-4 text-left shadow-[0_3px_12px_rgba(97,55,76,0.04)] sm:px-7 sm:py-5">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-[#542565] sm:text-base">
              {copy.orderInfo}
            </h2>
            <div className="mt-2 divide-y divide-[#F3E6E8] font-sans text-xs text-[#514256] sm:text-sm">
              {sessionId && (
                <div className="grid gap-1 py-2.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
                  <span className="font-medium text-[#697086]">{copy.orderRef}</span>
                  <span className="break-all font-mono text-[11px] font-semibold text-[#26304A] sm:text-xs">
                    {sessionId}
                  </span>
                </div>
              )}
              <div className="grid gap-1 py-2.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
                <span className="font-medium text-[#697086]">{copy.orderType}</span>
                <span className="font-semibold text-[#26304A] sm:text-right">{copy.orderTypeValue}</span>
              </div>
              <div className="grid gap-1 py-2.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
                <span className="font-medium text-[#697086]">{copy.paymentStatus}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#18B56E] sm:justify-self-end">
                  <span className="size-2 rounded-full bg-[#18B56E]" />
                  {copy.paymentStatusValue}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl bg-[#FFF4D8] px-4 py-3 text-left sm:px-7">
            <Truck className="size-9 shrink-0 text-[#82349B] sm:size-10" strokeWidth={1.8} />
            <span className="border-l border-[#C3A673] pl-3 font-sans text-sm font-semibold leading-snug text-[#5C2D74] sm:text-base">
              {copy.deliveryNotice}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:px-11">
            <Link
              href="/setting/ordered-book"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F03479] to-[#EA2870] px-6 font-sans text-base font-bold text-white shadow-[0_6px_14px_rgba(232,40,112,0.25)] transition hover:brightness-95"
            >
              <BookOpen className="size-5" />
              <span>{copy.viewOrderedBooks}</span>
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#F03479] bg-white px-6 font-sans text-base font-bold text-[#E92D71] transition hover:bg-[#FFF0F4]"
            >
              <Home className="size-5" />
              <span>{copy.returnHome}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function RocketIllustration({ className = "size-12" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Exhaust Flame */}
      <path
        d="M19 43C19 43 20.5 53 24 57C27.5 53 29 43 29 43H19Z"
        fill="#FBBF24"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 43C21.5 43 22.5 49 24 51.5C25.5 49 26.5 43 26.5 43H21.5Z"
        fill="#F59E0B"
      />

      {/* Left Fin */}
      <path
        d="M15 35C10.5 35 5.5 39 4.5 43C8.5 43 14 42 16.5 38L15 35Z"
        fill="#7F6EA0"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Right Fin */}
      <path
        d="M33 35C37.5 35 42.5 39 43.5 43C39.5 43 34 42 31.5 38L33 35Z"
        fill="#557F77"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Rocket Main Body */}
      <path
        d="M24 3C17 11 14 26 15 43H33C34 26 31 11 24 3Z"
        fill="#F472B6"
        stroke="#24222B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Window / Porthole */}
      <circle
        cx="24"
        cy="20"
        r="6"
        fill="#38BDF8"
        stroke="#24222B"
        strokeWidth="2"
      />
      <circle cx="26" cy="18" r="1.5" fill="white" />
    </svg>
  );
}

function ModalConfettiDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]"
      aria-hidden="true"
    >
      {/* Top Left Corner */}
      <div className="absolute -left-10 -top-14 size-40 rounded-full bg-[#E2ECE6] sm:size-44" />
      <svg
        className="absolute left-28 top-16 size-5 rotate-12 text-[#6BA4D8]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <polygon points="10,0 20,20 0,20" />
      </svg>
      <svg
        className="absolute left-10 top-28 size-7 text-[#FFB830]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="absolute left-6 top-44 size-2.5 rounded-full bg-[#FF7A59]" />
      <span className="absolute left-44 top-8 size-2.5 rounded-full bg-[#FFB830]" />

      {/* Top Right Corner */}
      <div className="absolute -right-10 -top-14 size-40 rounded-full bg-[#FDDCD8] sm:size-44" />
      <span className="absolute right-20 top-20 size-2.5 rounded-full bg-[#70B984]" />
      <svg
        className="absolute right-9 top-28 size-5 -rotate-45 text-[#F58778]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <polygon points="10,0 20,20 0,20" />
      </svg>
      <span className="absolute right-7 top-48 size-2.5 rounded-full bg-[#FFB830]" />

      {/* Bottom Left Corner */}
      <div className="absolute -bottom-10 -left-10 size-36 rounded-full bg-[#FCE3EB] sm:size-40" />
      <span className="absolute bottom-32 left-6 size-2.5 rounded-full bg-[#70B984]" />
      <span className="absolute bottom-20 left-8 size-2.5 rounded-full bg-[#FFB830]" />

      {/* Bottom Right Corner */}
      <div className="absolute -bottom-12 -right-12 size-40 rounded-full bg-[#FDE8B3] sm:size-44" />
      <svg
        className="absolute bottom-1 right-2 h-24 w-24"
        viewBox="0 0 60 60"
        fill="none"
      >
        <path
          d="M12 48C32 46 46 32 48 12"
          stroke="#7BC7C1"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute bottom-32 right-7 size-2.5 rounded-full bg-[#FF7A59]" />
    </div>
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
  const [downloading, setDownloading] = useState(false);
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

  const downloadBook = async () => {
    if (downloading) return;
    setDownloading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || session?.user?.accessToken;
      if (!token) throw new Error("Please sign in to download your book.");

      const response = await fetch(
        `${getApiBaseUrl()}/books/${encodeURIComponent(bookId)}/download?refresh=${Date.now()}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Unable to prepare your PDF download.");
      }

      const pdfBlob = await response.blob();
      const objectUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${(book?.title || "personalized-storybook").replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to prepare your PDF download.");
    } finally {
      setDownloading(false);
    }
  };

  const paid = Boolean(book?.paidAt);
  const completed = paid && book?.status === "COMPLETED";
  const failed = paid && book?.status === "FAILED";
  const isGenerating = paid && !completed && !failed;
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

  if (completed && !modalOpen) {
    return (
      <main className="flex items-center bg-[radial-gradient(circle_at_top,_#FFFDF9,_#FEF6EC_55%,_#F8EEF5)] px-3 py-6 sm:px-6 sm:py-9">
        <section className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[38px] border border-white/90 bg-[#FFFDFB] px-6 py-7 text-center shadow-[0_20px_55px_rgba(85,51,70,0.16)] sm:px-10 sm:py-8">
          <ModalConfettiDecorations />

          <div className="relative z-10">
            <Image
              src="/images/payment-success-check.png"
              alt=""
              width={1536}
              height={1024}
              priority
              className="mx-auto -my-5 h-[114px] w-[150px] object-contain sm:h-[128px] sm:w-[170px]"
            />

            <h1 className="mt-4 font-sans text-[30px] font-bold leading-tight tracking-tight text-[#162035] sm:text-[38px]">
              {copy.paymentSuccessful}!
            </h1>
            <p className="mt-1 font-sans text-[17px] font-medium text-[#626477] sm:text-[20px]">
              {copy.bookReady}
            </p>
            <p className="mt-2 break-all font-sans text-xs font-medium text-[#697086] sm:text-sm">
              {copy.bookReference}: {book?._id || bookId}
            </p>

            <Image
              src="/images/payment-success-book-hero.png"
              alt="A magical rocket rising from an open storybook"
              width={1536}
              height={1024}
              priority
              className="mx-auto my-3 h-[165px] w-full max-w-[390px] object-contain sm:my-4 sm:h-[185px] sm:max-w-[450px]"
            />

            <div className="rounded-[24px] border border-[#CBEBD9] bg-[#F3FCF5]/90 px-5 py-5 shadow-[0_3px_12px_rgba(42,140,91,0.05)] sm:px-9 sm:py-6">
              <div className="flex items-center justify-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#2DC76B] text-white shadow-sm">
                  <CheckCircle2 className="size-5" strokeWidth={3} />
                </span>
                <h2 className="font-sans text-[21px] font-bold text-[#162035] sm:text-[25px]">
                  {copy.creationComplete}
                </h2>
              </div>
              <p className="mx-auto mt-2 max-w-[490px] font-sans text-sm leading-relaxed text-[#626477] sm:text-[16px]">
                {copy.creationCompleteDescription}
              </p>

              <div className="mx-auto mt-4 flex w-full max-w-[330px] flex-col gap-2.5">
                <Link
                  href={`/story-books/book-details/${book?._id || bookId}`}
                  className="inline-flex h-11 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#F03479] to-[#EA2870] px-6 font-sans text-base font-bold text-white shadow-[0_6px_14px_rgba(232,40,112,0.25)] transition hover:brightness-95 sm:h-12 sm:text-lg"
                >
                  <BookOpen className="size-5" />
                  {copy.goToGeneratedBook}
                </Link>
                <button
                  type="button"
                  onClick={downloadBook}
                  disabled={downloading}
                  className="inline-flex h-11 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#F03479] to-[#EA2870] px-6 font-sans text-base font-bold text-white shadow-[0_6px_14px_rgba(232,40,112,0.25)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-lg"
                >
                  <Download className="size-5" />
                  {downloading ? `${copy.downloadBook}…` : copy.downloadBook}
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-3 font-sans text-xs text-[#B74760]">
                  {formatGenerationError(error)}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#514A52]/35 p-3 backdrop-blur-[2px] sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="generation-modal-title"
        >
          <div className="relative w-full max-w-[680px] overflow-hidden rounded-[38px] border border-white/90 bg-[#FFFDFB] px-6 py-8 text-center shadow-[0_24px_60px_rgba(60,30,50,0.22)] sm:px-12 sm:py-11">
            <ModalConfettiDecorations />

            <button
              type="button"
              aria-label="Close status"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 z-20 flex size-9 items-center justify-center rounded-full text-[#625B65] transition hover:bg-[#FCE6EE] hover:text-[#252025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] sm:right-7 sm:top-7"
            >
              <X size={20} strokeWidth={2.2} />
            </button>

            <div className="relative z-10 flex flex-col items-center">
              {/* Top Icon */}
              <div
                className={`flex items-center justify-center rounded-[24px] ${
                  failed
                    ? "size-20 bg-[#FFF0F2] text-[#B74760]"
                    : completed
                      ? "size-20 bg-[#E6F7ED] text-[#18B56E]"
                      : "size-24 rounded-[28px] bg-[#FFE4ED] shadow-sm sm:size-[116px]"
                }`}
              >
                {failed ? (
                  <AlertCircle size={36} />
                ) : completed ? (
                  <CheckCircle2 size={36} />
                ) : (
                  <RocketIllustration className="h-[68px] w-[58px] sm:h-[82px] sm:w-[68px]" />
                )}
              </div>

              {/* Title */}
              <h2
                id="generation-modal-title"
                className={`mt-6 font-sans font-bold leading-[1.12] tracking-tight text-[#162035] ${
                  isGenerating
                    ? "mx-auto max-w-[540px] text-[30px] sm:text-[40px]"
                    : "text-2xl sm:text-[28px]"
                }`}
              >
                {failed
                  ? copy.generationNeedsAttention
                  : completed
                    ? copy.bookReady
                    : paid
                      ? copy.creatingMagicalBook
                      : copy.confirmingPayment}
              </h2>

              {/* Subtitle */}
              <p className={`mx-auto mt-3 font-sans leading-[1.5] text-[#5A5560] ${
                isGenerating
                  ? "max-w-[530px] text-[16px] sm:text-[19px]"
                  : "max-w-[340px] text-sm sm:text-[15px]"
              }`}>
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
                <div className={`w-full border border-[#FBD6E0] bg-white shadow-[0_3px_10px_rgba(97,55,76,0.03)] ${
                  isGenerating
                    ? "mt-7 rounded-[22px] p-5 sm:px-6 sm:py-5"
                    : "mt-5 rounded-[22px] p-4 sm:p-5"
                }`}>
                  <div className={`flex items-center justify-between font-sans font-bold ${
                    isGenerating ? "text-[15px] sm:text-[18px]" : "text-xs sm:text-[13px]"
                  }`}>
                    <span className="text-[#162035]">
                      {completed ? copy.creationComplete : copy.addingFinalTouches}
                    </span>
                    <span className={completed ? "text-[#18B56E]" : "text-[#ED3875]"}>
                      {generationProgress}%
                    </span>
                  </div>
                  <div
                    className={`w-full overflow-hidden rounded-full bg-[#FCE3EB] ${
                      isGenerating ? "mt-4 h-4" : "mt-3 h-3"
                    }`}
                    role="progressbar"
                    aria-label="Book generation progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={generationProgress}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        completed
                          ? "bg-gradient-to-r from-[#32B978] via-[#4FCB8D] to-[#78D9A7]"
                          : "bg-gradient-to-r from-[#ED3875] via-[#F4608B] to-[#FF7A59]"
                      }`}
                      style={{ width: `${Math.max(generationProgress, 5)}%` }}
                    />
                  </div>
                  <p className={`font-sans font-normal text-[#756F7C] ${
                    isGenerating ? "mt-3 text-sm sm:text-[16px]" : "mt-3 text-xs"
                  }`}>
                    {completed ? copy.creationCompleteDescription : copy.thisMayTakeAMoment}
                  </p>
                </div>
              )}

              {!paid && !failed && (
                <div className="mt-6 flex flex-col items-center text-center">
                  <Loader2 size={24} className="animate-spin text-[#ED3875]" />
                  <p className="mt-3 text-xs text-[#756F7C]">{copy.thisMayTakeAMoment}</p>
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
                  className="mt-5 min-h-11 w-full rounded-xl bg-[#E88DA0] font-semibold text-white transition hover:bg-[#DD7893]"
                >
                  {copy.editAndRetry}
                </button>
              )}

              {failed && failureType === "IMAGE_QUALITY" && (
                <div className="mt-5 flex w-full flex-col gap-2">
                  <button
                    onClick={retry}
                    disabled={retrying}
                    className="min-h-11 w-full rounded-xl bg-[#E88DA0] font-semibold text-white transition hover:bg-[#DD7893] disabled:opacity-60"
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
                  className="mt-5 min-h-11 w-full rounded-xl bg-[#E88DA0] font-semibold text-white transition hover:bg-[#DD7893] disabled:opacity-60"
                >
                  {retrying ? `${copy.retryGeneration}…` : copy.retryGeneration}
                </button>
              )}

              {/* Hint text below card */}
              <p className={`mx-auto max-w-[420px] font-sans font-medium leading-relaxed text-[#5A5560] ${
                isGenerating ? "mt-5 text-sm sm:text-[16px]" : "mt-4 text-xs sm:text-[13px]"
              }`}>
                {copy.closeStatusHint}
              </p>

              {/* Email Pill Banner */}
              <div className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#FCDCE6] bg-[#FFEBF1] ${
                isGenerating ? "mt-5 px-5 py-2.5 sm:px-7 sm:py-3" : "mt-4 px-4 py-2 sm:px-5 sm:py-2.5"
              }`}>
                <svg
                  className={isGenerating ? "size-6 shrink-0 text-[#ED3875]" : "size-4 shrink-0 text-[#ED3875]"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className={`font-sans font-semibold text-[#162035] ${
                  isGenerating ? "text-sm sm:text-[16px]" : "text-xs sm:text-[12.5px]"
                }`}>
                  {copy.emailPdfNotification}
                </span>
              </div>
            </div>
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
