"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-hidden bg-[#f8eee8] bg-[url('/images/hero.png')] bg-cover bg-[position:62%_center] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-[1] after:h-16 after:bg-gradient-to-b after:from-transparent after:to-[#FBF3EA] sm:bg-[position:60%_center] sm:after:h-24 lg:h-screen lg:bg-center lg:after:h-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <Image
          src="/images/cloud.png"
          alt=""
          width={1536}
          height={1024}
          sizes="150px"
          className="absolute left-[3%] top-[14%] h-auto w-[150px] opacity-80 motion-safe:animate-hero-cloud"
        />
        <Image
          src="/images/cloud.png"
          alt=""
          width={1536}
          height={1024}
          sizes="110px"
          className="absolute left-[25%] top-[18%] h-auto w-[110px] opacity-70 motion-safe:animate-hero-cloud [animation-delay:-4s]"
        />
        <Image
          src="/images/cloud.png"
          alt=""
          width={1536}
          height={1024}
          sizes="135px"
          className="absolute bottom-[3%] left-[8%] h-auto w-[135px] opacity-70 motion-safe:animate-hero-cloud [animation-delay:-8s]"
        />
        <Image
          src="/images/cloud.png"
          alt=""
          width={1536}
          height={1024}
          sizes="100px"
          className="absolute left-[2%] top-[45%] h-auto w-[100px] opacity-70 motion-safe:animate-hero-cloud [animation-delay:-6s]"
        />
      </div>

      <div className="container relative z-10 mx-auto w-full pt-36 sm:pt-40 lg:px-0 lg:pt-[260px]">
        <div className="max-w-[577px]">
          <h1
            id="hero-heading"
            className="font-fredoka text-[clamp(2.5rem,4.45vw,4rem)] font-normal leading-[1.2]"
          >
            <span className="block text-[#E0A94C]">{t.hero.heading1}</span>
            <span className="block text-primary">{t.hero.heading2}</span>
            <span className="block text-secondary">{t.hero.heading3}</span>
          </h1>

          <p className="mt-6 max-w-[539px] text-base font-medium leading-[1.38] text-white md:text-[#444] sm:text-lg">
            {t.hero.subheading}
          </p>

          <Link
            href="/book-builder/choose-age"
            className="mt-6 inline-flex h-14 items-center justify-center rounded-2xl bg-[#e88da0] px-4 font-sans text-xl font-medium text-white shadow-[0_8px_18px_rgba(213,113,143,0.24)] transition hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
          >
            {t.hero.createBookBtn}
          </Link>
        </div>
      </div>

      <Image
        src="/images/hero_cloud.png"
        alt=""
        width={187}
        height={174}
        sizes="(max-width: 639px) 118px, (max-width: 1023px) 145px, 187px"
        className="pointer-events-none absolute bottom-[-24px] right-[-26px] z-0 h-auto w-[118px] sm:bottom-[-29px] sm:right-[-30px] sm:w-[145px] lg:bottom-[-35px] lg:right-[-20px] lg:w-[187px]"
      />
    </section>
  );
};

export default Hero;
