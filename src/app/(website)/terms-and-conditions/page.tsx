import PageHero from "../_components/PageHero";
import TermsAndConditions from "./_components/TermsAndConditions";

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        description="Please read the terms that apply when you use our website and services."
        imageAlt="Terms and conditions banner"
        imageSrc="/images/privacy.png"
      />
      <TermsAndConditions />
    </>
  );
}
