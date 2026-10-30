"use client";

import ReviewModal from "../_components/ReviewModal";

export default function ReviewsPage() {
  return <ReviewModal isOpen embedded onClose={() => undefined} onSubmitted={() => undefined} />;
}
