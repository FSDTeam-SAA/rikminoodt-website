"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useLanguage } from "@/components/providers/LanguageProvider";

const socialLinks = [
  { label: "Facebook", icon: FaFacebookF },
  { label: "Instagram", icon: FaInstagram },
  { label: "TikTok", icon: FaTiktok },
];

const getFooterHref = (label: string) => {
  const lower = label.toLowerCase();
  if (
    lower.includes("pricing") ||
    lower.includes("tarieven") ||
    lower.includes("preise") ||
    lower.includes("tarifs")
  ) {
    return "/pricing";
  }
  if (lower.includes("contact") || lower.includes("kontakt")) {
    return "/contact";
  }
  if (
    lower.includes("terms") ||
    lower.includes("conditions") ||
    lower.includes("voorwaarden") ||
    lower.includes("générales")
  ) {
    return "/terms-and-conditions";
  }
  if (lower.includes("privacy") || lower.includes("privacybeleid") || lower.includes("confidentialité")) {
    return "/privacy-policy";
  }
  if (
    lower.includes("how it works") ||
    lower.includes("hoe het werkt") ||
    lower.includes("wie es funktioniert") ||
    lower.includes("comment ça marche")
  ) {
    return "/how-it-works";
  }
  if (
    lower.includes("examples") ||
    lower.includes("voorbeelden") ||
    lower.includes("beispiele") ||
    lower.includes("exemples")
  ) {
    return "/examples";
  }
  if (
    lower.includes("create") ||
    lower.includes("maak") ||
    lower.includes("erstellen") ||
    lower.includes("créer") ||
    lower.includes("themes") ||
    lower.includes("thema")
  ) {
    return "/book-builder/choose-age";
  }
  return `#${lower.replaceAll(" ", "-")}`;
};

const Footer = () => {
  const { t } = useLanguage();

  const footerGroups = [
    {
      title: t.footer.groups.discover,
      links: [
        t.footer.links.bookThemes,
        t.footer.links.examples,
        t.footer.links.pricing,
        t.footer.links.howItWorks,
        t.footer.links.createYourBook,
      ],
    },
    {
      title: t.footer.groups.occasions,
      links: [
        t.footer.links.birthday,
        t.footer.links.christmas,
        t.footer.links.newBaby,
        t.footer.links.firstDayOfSchool,
        t.footer.links.justBecause,
      ],
    },
    {
      title: t.footer.groups.help,
      links: [
        t.footer.links.faqs,
        t.footer.links.contactUs,
        t.footer.links.termsAndConditions,
        t.footer.links.privacyPolicy,
      ],
    },
  ];

  return (
    <footer className="bg-[#4A3F52] font-sans text-white">
      <div className="container mx-auto px-6 py-11 sm:px-8 sm:py-12 lg:min-h-[407px] lg:px-0 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[396px_repeat(3,max-content)] lg:justify-between lg:gap-8">
          <section className="max-w-[310px]">
            <Link
              href="/"
              aria-label={t.nav.homeAria}
              className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eea0b4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#504557]"
            >
              <Image
                src="/images/logo.png"
                alt="Bookereillo"
                width={180}
                height={45}
                className="h-auto w-[150px]"
              />
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/90 lg:text-base">
              {t.footer.about}
            </p>
            <nav aria-label="Social media" className="mt-4 flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-7 items-center justify-center rounded-md text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eea0b4]"
                >
                  <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
                </Link>
              ))}
            </nav>
          </section>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-crimson text-2xl font-semibold">{group.title}</h2>
              <ul className="mt-3 space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={getFooterHref(link)}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/90 transition hover:text-[#f6bdca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eea0b4] lg:text-base"
                    >
                      <span aria-hidden="true" className="text-[9px] transition-transform group-hover:translate-x-0.5">
                        ▸
                      </span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-9 border-t border-white/30 pt-5 text-center text-sm text-white/90 sm:mt-11 lg:mt-8 lg:text-base">
          © {new Date().getFullYear()} Boekerello. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
