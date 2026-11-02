"use client";

import { ImagePlus, Loader2, Star, X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  embedded?: boolean;
};

const reviewLabels = {
  nl: {
    title: "Deel je ervaring",
    description: "Vertel andere families over jouw gepersonaliseerde verhalenboek.",
    notSignedIn: "Meld je aan om een review te plaatsen.",
    signIn: "Inloggen",
    yourRating: "Jouw beoordeling",
    rateAria: (value: number) => `Geef ${value} van de 5 sterren`,
    starsAria: (rating: number) => `${rating} van de 5 sterren`,
    yourReview: "Jouw review",
    placeholder: "Wat vond jouw gezin leuk aan het boek?",
    addPhoto: "Voeg een foto toe",
    photoOptional: "Optioneel, JPG of PNG",
    submitReview: "Review versturen",
    submitting: "Bezig met versturen…",
    successMsg: "Bedankt! Jouw review is succesvol ingediend.",
    errorMsg: "We konden je review niet versturen. Probeer het opnieuw.",
    closeAria: "Sluit reviewformulier",
    photoAlt: "Geselecteerde reviewfoto",
  },
  en: {
    title: "Share your review",
    description: "Tell other families about your personalised storybook.",
    notSignedIn: "Please sign in to submit a review.",
    signIn: "Sign in",
    yourRating: "Your rating",
    rateAria: (value: number) => `Rate ${value} out of 5`,
    starsAria: (rating: number) => `${rating} out of 5 stars`,
    yourReview: "Your review",
    placeholder: "What did your family enjoy about the book?",
    addPhoto: "Add a photo",
    photoOptional: "Optional, JPG or PNG",
    submitReview: "Submit review",
    submitting: "Submitting…",
    successMsg: "Thank you! Your review has been submitted.",
    errorMsg: "We could not submit your review. Please try again.",
    closeAria: "Close review form",
    photoAlt: "Selected review photo",
  },
  fr: {
    title: "Partagez votre avis",
    description: "Racontez aux autres familles votre expérience avec votre livre personnalisé.",
    notSignedIn: "Veuillez vous connecter pour publier un avis.",
    signIn: "Se connecter",
    yourRating: "Votre note",
    rateAria: (value: number) => `Noter ${value} sur 5`,
    starsAria: (rating: number) => `${rating} étoiles sur 5`,
    yourReview: "Votre avis",
    placeholder: "Qu'est-ce que votre famille a apprécié dans ce livre ?",
    addPhoto: "Ajouter une photo",
    photoOptional: "Optionnel, JPG ou PNG",
    submitReview: "Envoyer l'avis",
    submitting: "Envoi en cours…",
    successMsg: "Merci ! Votre avis a été envoyé avec succès.",
    errorMsg: "Impossible d'envoyer votre avis. Veuillez réessayer.",
    closeAria: "Fermer le formulaire d'avis",
    photoAlt: "Photo d'avis sélectionnée",
  },
} as const;

const ReviewModal = ({ isOpen, onClose, onSubmitted, embedded = false }: ReviewModalProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const copy = reviewLabels[language] || reviewLabels.nl;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  useEffect(() => {
    if (!isOpen) return;
    setSuccess("");
  }, [isOpen]);

  if (!isOpen) return null;

  const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("rating", String(rating));
      form.append("comment", comment.trim());
      if (photo) form.append("photo", photo);
      const response = await fetch(`${getApiBaseUrl()}/reviews`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || copy.errorMsg);
      setSuccess(copy.successMsg);
      onSubmitted();
      setComment("");
      setPhoto(null);
    } catch (submitError) {
      window.alert(
        submitError instanceof Error
          ? submitError.message
          : copy.errorMsg,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={embedded ? "min-h-[70vh] bg-[#FEFAF4] px-4 py-16 sm:py-20" : "fixed inset-0 z-[70] flex items-center justify-center bg-[#302735]/45 p-4"} role={embedded ? undefined : "dialog"} aria-modal={embedded ? undefined : true} aria-labelledby="review-modal-title">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#FFFDFC] p-5 shadow-2xl sm:p-7">
        {!embedded && <button type="button" onClick={onClose} aria-label={copy.closeAria} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-[#FFF0F3] text-[#D36F87] transition hover:bg-[#FAD8DF]"><X size={18} aria-hidden="true" /></button>}
        <h2 id="review-modal-title" className="pr-10 font-crimson text-3xl font-semibold text-[#302735]">{copy.title}</h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#756E73]">{copy.description}</p>

        {!token ? (
          <div className="mt-6 rounded-xl border border-[#F3A8B7] bg-[#FFF7F8] p-5 text-center">
            <p className="font-sans text-sm text-[#514256]">{copy.notSignedIn}</p>
            <button type="button" onClick={() => router.push("/sign-in")} className="mt-4 rounded-lg bg-[#E88DA0] px-5 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]">{copy.signIn}</button>
          </div>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={submit}>
            <fieldset>
              <legend className="font-sans text-sm font-semibold text-[#514256]">{copy.yourRating}</legend>
              <div className="mt-2 flex gap-1" aria-label={copy.starsAria(rating)}>
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <button key={value} type="button" onClick={() => setRating(value)} aria-label={copy.rateAria(value)} className="rounded p-1 text-[#F6AA16] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]">
                      <Star size={28} fill={value <= rating ? "currentColor" : "none"} strokeWidth={1.8} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="block">
              <span className="font-sans text-sm font-semibold text-[#514256]">{copy.yourReview}</span>
              <textarea required value={comment} maxLength={1000} onChange={(event) => setComment(event.target.value)} placeholder={copy.placeholder} className="mt-2 min-h-[130px] w-full resize-y rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#AAA5A8] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25" />
              <span className="mt-1 block text-right font-sans text-xs text-[#8A7982]">{comment.length}/1000</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#F3A8B7] bg-[#FFF9FA] p-3 transition hover:bg-[#FFF3F5]">
              {previewUrl ? <Image src={previewUrl} alt={copy.photoAlt} width={56} height={56} unoptimized className="size-14 rounded-lg object-cover" /> : <span className="flex size-12 items-center justify-center rounded-full bg-[#FFE8ED] text-[#D36F87]"><ImagePlus size={21} aria-hidden="true" /></span>}
              <span className="min-w-0 flex-1 font-sans text-sm text-[#514256]"><strong className="block">{copy.addPhoto}</strong><span className="text-xs text-[#8A7982]">{copy.photoOptional}</span></span>
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
            </label>
            {success && <p role="status" className="font-sans text-sm text-[#23936F]">{success}</p>}
            <button type="submit" disabled={isSubmitting || !comment.trim()} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-sm font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <Loader2 size={17} className="animate-spin" aria-hidden="true" />} {copy.submitReview}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
