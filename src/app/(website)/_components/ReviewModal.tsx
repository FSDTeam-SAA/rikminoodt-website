"use client";

import { ImagePlus, Loader2, Star, X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getApiBaseUrl } from "@/config/api";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
};

const ReviewModal = ({ isOpen, onClose, onSubmitted }: ReviewModalProps) => {
  const { data: session } = useSession();
  const router = useRouter();
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
      if (!response.ok) throw new Error(result?.message || "We could not submit your review. Please try again.");
      setSuccess("Thank you! Your review has been submitted.");
      onSubmitted();
      setComment("");
      setPhoto(null);
    } catch (submitError) {
      window.alert(
        submitError instanceof Error
          ? submitError.message
          : "We could not submit your review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#302735]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#FFFDFC] p-5 shadow-2xl sm:p-7">
        <button type="button" onClick={onClose} aria-label="Close review form" className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-[#FFF0F3] text-[#D36F87] transition hover:bg-[#FAD8DF]">
          <X size={18} aria-hidden="true" />
        </button>
        <h2 id="review-modal-title" className="pr-10 font-crimson text-3xl font-semibold text-[#302735]">Share your review</h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#756E73]">Tell other families about your personalised storybook.</p>

        {!token ? (
          <div className="mt-6 rounded-xl border border-[#F3A8B7] bg-[#FFF7F8] p-5 text-center">
            <p className="font-sans text-sm text-[#514256]">Please sign in to submit a review.</p>
            <button type="button" onClick={() => router.push("/sign-in")} className="mt-4 rounded-lg bg-[#E88DA0] px-5 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]">Sign in</button>
          </div>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={submit}>
            <fieldset>
              <legend className="font-sans text-sm font-semibold text-[#514256]">Your rating</legend>
              <div className="mt-2 flex gap-1" aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <button key={value} type="button" onClick={() => setRating(value)} aria-label={`Rate ${value} out of 5`} className="rounded p-1 text-[#F6AA16] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]">
                      <Star size={28} fill={value <= rating ? "currentColor" : "none"} strokeWidth={1.8} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="block">
              <span className="font-sans text-sm font-semibold text-[#514256]">Your review</span>
              <textarea required value={comment} maxLength={1000} onChange={(event) => setComment(event.target.value)} placeholder="What did your family enjoy about the book?" className="mt-2 min-h-[130px] w-full resize-y rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#AAA5A8] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25" />
              <span className="mt-1 block text-right font-sans text-xs text-[#8A7982]">{comment.length}/1000</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#F3A8B7] bg-[#FFF9FA] p-3 transition hover:bg-[#FFF3F5]">
              {previewUrl ? <Image src={previewUrl} alt="Selected review photo" width={56} height={56} unoptimized className="size-14 rounded-lg object-cover" /> : <span className="flex size-12 items-center justify-center rounded-full bg-[#FFE8ED] text-[#D36F87]"><ImagePlus size={21} aria-hidden="true" /></span>}
              <span className="min-w-0 flex-1 font-sans text-sm text-[#514256]"><strong className="block">Add a photo</strong><span className="text-xs text-[#8A7982]">Optional, JPG or PNG</span></span>
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
            </label>
            {success && <p role="status" className="font-sans text-sm text-[#23936F]">{success}</p>}
            <button type="submit" disabled={isSubmitting || !comment.trim()} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-sm font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <Loader2 size={17} className="animate-spin" aria-hidden="true" />} Submit review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
