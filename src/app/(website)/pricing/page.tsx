import { Metadata } from "next";
import PricingPage from "./_components/PricingPage";

export const metadata: Metadata = {
  title: "Pricing | Bookerello",
  description: "Simple pricing for magical personalized children's books.",
};

export default function Page() {
  return <PricingPage />;
}

