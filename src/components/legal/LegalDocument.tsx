"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import PageHero from "@/app/(website)/_components/PageHero";
import { useLanguage } from "@/components/providers/LanguageProvider";
import privacyContent from "@/content/legal/privacy.json";
import termsContent from "@/content/legal/terms.json";

type Lang = "nl" | "en" | "fr";

type ListItem = { text: string; children?: ListItem[] };
type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string; id: string; num: number; label: string }
  | { type: "p"; text: string }
  | { type: "ol"; items: ListItem[] }
  | { type: "table"; header: string[]; rows: string[][] };

const documents = {
  privacy: privacyContent as unknown as Record<Lang, Block[]>,
  terms: termsContent as unknown as Record<Lang, Block[]>,
};

const copy = {
  privacy: {
    en: { title: "Privacy Policy", description: "Learn how we collect, use, and protect your information." },
    nl: { title: "Privacybeleid", description: "Lees hoe wij uw gegevens verzamelen, gebruiken en beschermen." },
    fr: { title: "Politique de confidentialité", description: "Découvrez comment nous collectons, utilisons et protégeons vos données." },
  },
  terms: {
    en: { title: "Terms & Conditions", description: "Please read the terms that apply when you use our website and services." },
    nl: { title: "Algemene voorwaarden", description: "Lees de voorwaarden die van toepassing zijn op het gebruik van onze website en diensten." },
    fr: { title: "Conditions générales", description: "Veuillez lire les conditions applicables à l’utilisation de notre site et de nos services." },
  },
} as const;

const ui = {
  en: { contents: "Contents", help: "Need help?", helpText: "Our team is here to assist you with any questions.", intro: "Introduction", bannerPrivacy: "Questions about this Policy?", bannerTerms: "Questions about these Terms?", bannerText: "Our team is happy to help clarify any section.", cta: "Contact us" },
  nl: { contents: "Inhoud", help: "Hulp nodig?", helpText: "Ons team helpt u graag met al uw vragen.", intro: "Inleiding", bannerPrivacy: "Vragen over dit beleid?", bannerTerms: "Vragen over deze voorwaarden?", bannerText: "Ons team helpt u graag om elk onderdeel te verduidelijken.", cta: "Neem contact op" },
  fr: { contents: "Sommaire", help: "Besoin d’aide ?", helpText: "Notre équipe est là pour répondre à toutes vos questions.", intro: "Introduction", bannerPrivacy: "Des questions sur cette politique ?", bannerTerms: "Des questions sur ces conditions ?", bannerText: "Notre équipe se fera un plaisir de clarifier chaque section.", cta: "Nous contacter" },
} as const;

/** Renders **bold**, _italic_ and auto-links e-mail addresses / www URLs. */
function renderInline(text: string) {
  const italicWhole = text.length > 2 && text.startsWith("_") && text.endsWith("_");
  const source = italicWhole ? text.slice(1, -1) : text;
  const parts = source.split(/(\*\*[^*]+\*\*)/g);
  const nodes = parts.map((part, index) => {
    const isBold = part.startsWith("**") && part.endsWith("**");
    const inner = isBold ? part.slice(2, -2) : part;
    const linked = inner.split(/([\w.+-]+@[\w-]+\.[\w.-]+|www\.[\w-]+(?:\.[\w-]+)+)/g).map((chunk, i) => {
      if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(chunk)) {
        return (
          <a key={i} href={`mailto:${chunk}`} className="font-medium text-[#DF7088] underline underline-offset-2 hover:text-[#C9506C]">
            {chunk}
          </a>
        );
      }
      if (/^www\.[\w-]+(\.[\w-]+)+$/.test(chunk)) {
        return (
          <a key={i} href={`https://${chunk}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[#DF7088] underline underline-offset-2 hover:text-[#C9506C]">
            {chunk}
          </a>
        );
      }
      return <Fragment key={i}>{chunk}</Fragment>;
    });
    return isBold ? (
      <strong key={index} className="font-semibold text-[#1E293B]">
        {linked}
      </strong>
    ) : (
      <Fragment key={index}>{linked}</Fragment>
    );
  });
  return italicWhole ? <em>{nodes}</em> : <>{nodes}</>;
}

function List({ items, nested = false }: { items: ListItem[]; nested?: boolean }) {
  return (
    <ol className={`list-decimal space-y-1.5 pl-6 marker:text-[#DF7088] ${nested ? "mt-1.5" : ""}`}>
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          {renderInline(item.text)}
          {item.children && item.children.length > 0 && <List items={item.children} nested />}
        </li>
      ))}
    </ol>
  );
}

function renderBlock(block: Block, key: number) {
  switch (block.type) {
    case "p":
      return <p key={key}>{renderInline(block.text)}</p>;
    case "ol":
      return <List key={key} items={block.items} />;
    case "table":
      return (
        <div key={key} className="overflow-x-auto rounded-xl border border-[#F3D4DC]">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm sm:text-[15px]">
            <thead className="bg-[#FFF0F3] text-[#1E293B]">
              <tr>
                {block.header.map((cell, index) => (
                  <th key={index} className="px-4 py-3 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-[#F3D4DC] align-top">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`px-4 py-3 ${cellIndex === 0 ? "w-[38%] font-medium text-[#1E293B]" : ""}`}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function LegalDocument({ doc }: { doc: "privacy" | "terms" }) {
  const { language } = useLanguage();
  const lang: Lang = language === "nl" || language === "fr" ? language : "en";
  const labels = ui[lang];
  const heading = copy[doc][lang];

  const sections = useMemo(() => {
    const blocks = documents[doc][lang].filter((block) => block.type !== "h1");
    const result: { id: string; title: string; blocks: Block[] }[] = [];
    let current: { id: string; title: string; blocks: Block[] } = { id: "intro", title: labels.intro, blocks: [] };
    for (const block of blocks) {
      if (block.type === "h2") {
        if (current.blocks.length > 0 || current.id !== "intro") result.push(current);
        current = { id: block.id, title: block.text, blocks: [] };
      } else {
        current.blocks.push(block);
      }
    }
    result.push(current);
    return result.filter((section) => section.blocks.length > 0 || section.id !== "intro");
  }, [doc, lang, labels.intro]);

  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const ids = sections.map((section) => section.id);
    const update = () => {
      const active = ids.reduce((activeId, id) => {
        const element = document.getElementById(id);
        return element && element.getBoundingClientRect().top <= 160 ? id : activeId;
      }, ids[0]);
      setActiveSection((current) => (current === active ? current : active));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [sections]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHero
        title={heading.title}
        description={heading.description}
        imageAlt={`${heading.title} banner`}
        imageSrc="/images/privacy.png"
      />
      <div className="min-h-screen bg-white px-4 py-12 font-inter text-[#4A4A4A] antialiased sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-16">
            <aside className="md:col-span-3">
              <div className="space-y-6 md:sticky md:top-24 lg:top-[104px]">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#DF7088]">{labels.contents}</h3>
                <nav className="max-h-[60vh] space-y-1.5 overflow-y-auto pr-1 text-sm sm:text-[15px] [scrollbar-width:thin]">
                  {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => scrollTo(section.id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`block w-full rounded-r-lg border-l-2 px-3 py-2 text-left transition-all duration-150 ${
                          isActive
                            ? "border-[#DF7088] bg-[#FFF0F3] font-semibold text-[#6C5CE7] shadow-[0_2px_8px_rgba(223,112,136,0.12)]"
                            : "border-transparent text-[#5C5C5C] hover:bg-[#FFF8FA] hover:text-[#111111]"
                        }`}
                      >
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
                <div className="pt-4 text-sm leading-relaxed">
                  <p className="font-semibold text-[#3B66FF]">{labels.help}</p>
                  <p className="mt-0.5 text-[#71717A]">{labels.helpText}</p>
                </div>
              </div>
            </aside>

            <main className="space-y-10 md:col-span-9">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32 space-y-3.5">
                  {section.id !== "intro" && (
                    <h2 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">{section.title}</h2>
                  )}
                  <div className="space-y-3 text-[15px] leading-relaxed text-[#475569] sm:text-base">
                    {section.blocks.map((block, index) => renderBlock(block, index))}
                  </div>
                </section>
              ))}
            </main>
          </div>

          <div className="relative mt-14 overflow-hidden rounded-2xl bg-gradient-to-r from-[#EB7F96] via-[#E8738D] to-[#E56884] p-6 text-white shadow-sm sm:p-10">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold tracking-wide text-white sm:text-2xl">
                  {doc === "privacy" ? labels.bannerPrivacy : labels.bannerTerms}
                </h3>
                <p className="mt-1 text-xs text-white/90 sm:text-sm">{labels.bannerText}</p>
              </div>
              <a
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-[#1F2937] shadow-sm transition-colors hover:bg-slate-50 sm:text-sm"
              >
                <MessageSquare className="h-4 w-4 text-[#4B5563]" />
                {labels.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
