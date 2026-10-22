import PageHero from "../_components/PageHero";
import PrivacyPolicy from "./_components/PrivacyPolicy";

const Page = () => {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        description="Learn how we collect, use, and protect your information."
        imageAlt="Privacy policy banner"
        imageSrc="/images/privacy.png"
      />
      <PrivacyPolicy />
    </>
  );
};

export default Page;
