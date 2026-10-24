"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

const termsSections: TermsSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      "These Terms & Conditions govern your use of our website and services for creating personalised children's books. By accessing or using our website, you agree to be bound by these terms. If you do not agree, please do not use our website.",
    ],
  },
  {
    id: "use-of-services",
    title: "2. Use of Our Services",
    paragraphs: [
      "Our services allow you to create personalised children's books using information, photos, and preferences you provide. You must be at least 18 years old or have the consent of a parent or guardian to use this website.",
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts",
    paragraphs: [
      "You may need to create an account to save your projects, access your orders, and use certain features. You are responsible for keeping your account information secure and for all activity that occurs under your account.",
    ],
  },
  {
    id: "orders-and-payments",
    title: "4. Orders and Payments",
    paragraphs: [
      "Our products are designed for children but must be used by a parent, guardian, or authorised adult. Photos and information about a child are used only to create the personalised product you request. We do not intentionally collect personal information from children without adult consent.",
    ],
  },
  {
    id: "user-responsibilities",
    title: "5. User Responsibilities",
    paragraphs: [
      "You agree not to upload any content that is illegal, offensive, or infringes on the rights of others. You must not use our services for harmful or unauthorised purposes.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "6. Limitation of Liability",
    paragraphs: [
      "We strive to provide high-quality services, but we do not guarantee that our website will be error-free or uninterrupted. We are not liable for any indirect or consequential damages arising from your use of our services.",
    ],
  },
  {
    id: "changes-to-terms",
    title: "7. Changes to These Terms",
    paragraphs: [
      "We may update these Terms & Conditions from time to time. The latest version will always be published on this page with the updated date.",
    ],
  },
  {
    id: "governing-law",
    title: "8. Governing Law",
    paragraphs: [
      "These Terms are governed by the applicable laws of the country in which our business operates. Any dispute will be handled by the courts with the appropriate jurisdiction.",
    ],
  },
  {
    id: "privacy-policy",
    title: "9. Changes to This Policy",
    paragraphs: [
      "Your use of our services is also subject to our Privacy Policy, which explains how we collect, use, and protect your information.",
    ],
  },
  {
    id: "contact-us",
    title: "10. Contact Us",
    paragraphs: [
      "If you have any questions about these Terms & Conditions, please contact our support team. We will be happy to help clarify any part of these terms.",
    ],
  },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const sectionIds = termsSections.map((section) => section.id);

    const updateActiveSection = () => {
      const currentSection = sectionIds.reduce((activeId, id) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= 160 ? id : activeId;
      }, sectionIds[0]);

      setActiveSection((current) => current === currentSection ? current : currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 font-inter text-[#4A4A4A] antialiased sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-16">
          <aside className="md:col-span-3">
            <div className="sticky top-24 space-y-6 lg:top-[104px]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#DF7088]">Contents</h3>

              <nav className="space-y-3.5 text-sm sm:text-[15px]" aria-label="Terms and conditions contents">
                {termsSections.map((section) => {
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
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

              <div className="pt-8 text-sm leading-relaxed">
                <p className="font-semibold text-[#3B66FF]">Need help?</p>
                <p className="mt-0.5 text-[#71717A]">Our team is here to assist you with any questions.</p>
              </div>
            </div>
          </aside>

          <main className="space-y-10 md:col-span-9">
            <div className="flex items-start gap-3 rounded-md border border-[#FCD34D] bg-[#FFFBEB] p-3.5 sm:items-center">
              <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[#D97706] p-0.5 text-[10px] font-bold text-[#D97706]">
                i
              </div>
              <p className="text-xs font-medium leading-snug text-[#B45309] sm:text-sm">
                <span className="font-semibold">Terms Summary:</span> By using our website and services, you agree to these Terms &amp; Conditions. If you do not agree, please do not use our website.
              </p>
            </div>

            {termsSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32 space-y-3.5">
                <h2 className="text-2xl font-bold text-[#1E293B] sm:text-3xl">{section.title}</h2>
                <div className="space-y-3 text-[15px] leading-relaxed text-[#475569] sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.list && (
                    <ul className="list-disc space-y-1.5 pl-5">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </main>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-2xl bg-gradient-to-r from-[#EB7F96] via-[#E8738D] to-[#E56884] p-6 text-white shadow-sm sm:p-10">
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="relative flex shrink-0 items-center">
                <div className="z-10 flex h-14 w-12 -rotate-6 transform flex-col items-center justify-center rounded-xl border-2 border-white/80 bg-[#FDE68A] p-1 shadow-md">
                  <div className="text-base">🐻</div>
                  <span className="mt-1 text-[7px] font-bold text-[#92400E]">NOLLIE</span>
                </div>
                <div className="z-20 -ml-3 flex h-16 w-14 rotate-3 transform flex-col items-center justify-between rounded-xl border-2 border-white/80 bg-[#BAE6FD] p-1.5 shadow-md">
                  <div className="flex size-6 items-center justify-center rounded-full bg-[#FBBF24] text-[10px]">😊</div>
                  <div className="rounded bg-[#FBBF24] px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-tighter text-[#78350F]">Story Book</div>
                </div>
                <div className="-ml-4 flex h-12 w-10 rotate-12 transform items-center justify-center rounded-lg bg-[#F43F5E]/60 text-xs opacity-80">🎁</div>
                <svg className="ml-2 hidden h-10 w-20 text-white/80 sm:block" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M 0 25 C 20 5, 30 45, 50 25 C 65 10, 75 35, 90 25" />
                  <polyline points="85 18 92 25 84 31" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-wide text-white sm:text-2xl">Questions about these Terms?</h3>
                <p className="mt-1 text-xs text-white/90 sm:text-sm">Our team is happy to help clarify any section before you sign up.</p>
              </div>
            </div>

            <a href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-[#1F2937] shadow-sm transition-colors hover:bg-slate-50 sm:text-sm">
              <MessageSquare className="size-4 text-[#4B5563]" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
