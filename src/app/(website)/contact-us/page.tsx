import { Metadata } from "next";
import ContactPage from "../contact/_components/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | Bookerello",
  description: "Get in touch with the Bookerello team. We are here to help with your personalized storybooks.",
};

export default function Page() {
  return <ContactPage />;
}

