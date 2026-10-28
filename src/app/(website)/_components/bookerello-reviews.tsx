"use client";

import Image from "next/image";
import { Loader2, MessageCirclePlus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";
import ReviewModal from "./ReviewModal";

type Review = {
  _id: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  user?: { name?: string; username?: string; profileImage?: string };
};

type ReviewSummary = { averageRating: number; totalReviews: number };

const reviewColours = ["bg-[#f8dfe0]", "bg-[#dceef3]", "bg-[#fff0c8]", "bg-[#e8ddf2]", "bg-[#e2f1e4]"];

const BookerelloReviews = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const apiBaseUrl = getApiBaseUrl();
        const [reviewsResponse, summaryResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/reviews?limit=8`, { signal: controller.signal, cache: "no-store" }),
          fetch(`${apiBaseUrl}/reviews/summary`, { signal: controller.signal, cache: "no-store" }),
        ]);
        const reviewsPayload = await reviewsResponse.json().catch(() => null);
        const summaryPayload = await summaryResponse.json().catch(() => null);
        if (!controller.signal.aborted && reviewsResponse.ok) setReviews(reviewsPayload?.data?.reviews ?? []);
        if (!controller.signal.aborted && summaryResponse.ok) setSummary(summaryPayload?.data ?? null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setReviews([]);
          setSummary(null);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void loadReviews();
    return () => controller.abort();
  }, [refreshKey]);

  const averageRating = summary?.averageRating ?? 0;
  const totalReviews = summary?.totalReviews ?? reviews.length;
  const ratingText = totalReviews
    ? `${averageRating.toFixed(1)} · ${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`
    : t.reviews.ratingText;

  return (
    <section aria-labelledby="reviews-heading" className="py-14 sm:py-16 lg:mb-32 lg:pb-[25px] lg:pt-0">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="reviews-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">{t.reviews.title}</h2>
          <p className="mx-auto mt-2 max-w-4xl text-center font-sans text-[18px] font-normal leading-normal text-[#444444]">{t.reviews.subheading}</p>
          <div className="mt-2 flex items-center justify-center gap-2" aria-label={t.reviews.ratingAria}>
            <span className="flex gap-1 text-[#f6aa16]" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill={index < Math.round(averageRating || 5) ? "currentColor" : "none"} strokeWidth={1.5} />)}
            </span>
            <span className="text-xs text-[#607cb2] lg:text-sm">{ratingText}</span>
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E88DA0] px-5 font-sans text-sm font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2">
            <MessageCirclePlus size={18} aria-hidden="true" /> Write a review
          </button>
        </header>

        {isLoading ? (
          <div className="mt-12 flex min-h-[220px] items-center justify-center" role="status"><Loader2 className="animate-spin text-[#E88DA0]" size={30} aria-hidden="true" /><span className="sr-only">Loading reviews</span></div>
        ) : reviews.length ? (
          <div className="mx-auto mt-8 grid gap-5 sm:grid-cols-2 lg:mt-12 xl:grid-cols-4 xl:gap-x-3 xl:gap-y-8">
            {reviews.map((review, index) => {
              const reviewerName = review.user?.name || review.user?.username || "Bookerello family";
              return (
                <article key={review._id} className={`relative overflow-hidden rounded-sm p-5 shadow-[0_1px_2px_rgba(92,76,84,0.08)] sm:p-6 xl:min-h-[289px] xl:px-[15px] xl:pb-4 xl:pt-[12px] ${index % 2 === 1 ? "xl:translate-y-5" : ""} ${reviewColours[index % reviewColours.length]}`}>
                  {review.photoUrl && <div className="relative overflow-hidden rounded-sm"><Image src={review.photoUrl} alt={`Photo shared by ${reviewerName}`} width={510} height={292} className="aspect-[1.747] w-full object-cover xl:h-[141px] xl:aspect-auto" /></div>}
                  <div className={`${review.photoUrl ? "mt-4 xl:mt-2" : ""} flex items-center gap-3 xl:gap-2`}>
                    {review.user?.profileImage ? <Image src={review.user.profileImage} alt="" width={56} height={56} className="size-11 rounded-full border-2 border-[#eb9bad] object-cover xl:size-7 xl:border-0" /> : <span className="flex size-11 items-center justify-center rounded-full border-2 border-[#eb9bad] bg-white/70 font-sans text-sm font-semibold text-[#A06676] xl:size-7 xl:border-0 xl:text-xs" aria-hidden="true">{reviewerName.slice(0, 1).toUpperCase()}</span>}
                    <span className="min-w-0 flex-1 truncate text-[clamp(1.25rem,2.25vw,2rem)] font-medium leading-none text-[#262224] xl:text-base xl:text-[#3f3a3e]">{reviewerName}</span>
                    <span className="flex shrink-0 gap-0.5 text-[#ffb30e] xl:text-[#f6aa16]" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={18} fill={starIndex < review.rating ? "currentColor" : "none"} strokeWidth={1.5} className="xl:size-3" />)}</span>
                  </div>
                  <p className="ml-14 mt-1 text-base text-[#05a875] xl:ml-9 xl:mt-0.5 xl:text-xs xl:text-[#23a174]">✓ Verified Customer</p>
                  <p className="mt-5 text-[clamp(1.1rem,2.05vw,1.8rem)] leading-[1.35] text-[#31445d] xl:mt-2 xl:text-sm xl:text-[#4e4950]">“{review.comment}”</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-[#FFF4F6] px-6 py-10 text-center"><p className="font-crimson text-2xl font-semibold text-[#514256]">Be the first to share your story.</p><p className="mt-2 font-sans text-sm text-[#756E73]">Your review will appear here after you submit it.</p></div>
        )}
      </div>
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmitted={() => setRefreshKey((value) => value + 1)} />
    </section>
  );
};

export default BookerelloReviews;
