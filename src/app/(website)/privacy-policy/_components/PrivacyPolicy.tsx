'use client';

import React, { useState } from 'react';
import {  MessageSquare } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'introduction', label: '1. Introduction' },
  { id: 'information-we-collect', label: '2. Information We Collect' },
  { id: 'how-we-use', label: '3. How We Use Your Information' },
  { id: 'children-data', label: "4. Children's Data & Photos" },
  { id: 'subscription-billing', label: '5. Subscription & Billing' },
  { id: 'cookies-analytics', label: '6. Cookies & Analytics' },
  { id: 'privacy-rights', label: '7. Your Privacy Rights' },
  { id: 'data-security', label: '8. Data Security' },
  { id: 'changes-to-policy', label: '9. Changes to This Policy' },
  { id: 'contact-us', label: '10. Contact Us' },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#4A4A4A] py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid: Sidebar + Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Sticky Sidebar */}
          <aside className="md:col-span-3">
            <div className="sticky top-8 space-y-6">
              <h3 className="text-xs font-semibold text-[#DF7088] uppercase tracking-wider">
                Contents
              </h3>
              
              <nav className="space-y-3.5 text-xs sm:text-[13px]">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left transition-all duration-150 ${
                        isActive
                          ? 'text-[#6C5CE7] font-semibold pl-2.5 border-l-2 border-[#DF7088]'
                          : 'text-[#5C5C5C] hover:text-[#111111] pl-3 border-l-2 border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-8 text-xs leading-relaxed">
                <p className="font-semibold text-[#3B66FF]">Need help?</p>
                <p className="text-[#71717A] mt-0.5">
                  Our team is here to assist you with any questions.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="md:col-span-9 space-y-10">
            {/* Top Amber Notice Box */}
            <div className="rounded-md border border-[#FCD34D] bg-[#FFFBEB] p-3.5 flex items-start sm:items-center gap-3">
              <div className="rounded-full border border-[#D97706] text-[#D97706] p-0.5 flex-shrink-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold">
                i
              </div>
              <p className="text-[11px] sm:text-xs text-[#B45309] leading-snug font-medium">
                <span className="font-semibold">Privacy Summary:</span> We only collect information needed to create and deliver your personalized books. Your photos and personalization details are kept secure and are never sold to advertisers.
              </p>
            </div>

            {/* Section 1 */}
            <section id="introduction" className="scroll-mt-8 space-y-3.5">
              <h2 className="text-2xl font-serif font-bold text-[#1E293B]">
                1. Introduction
              </h2>
              <div className="text-[13px] sm:text-sm text-[#475569] leading-relaxed space-y-3">
                <p>
                  We collect information that you provide directly to us, including: Account information (name, email address, password, contact details) Child personalisation details (name, age, interests, preferences) Technical and usage information (IP address, device type, browser, etc.)
                </p>
                <p>
                  By creating an account or using Noltra.ai, you agree to comply with these terms. If you do not agree with any part of these Terms &amp; Conditions, please discontinue use of the platform. Order and payment information
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="information-we-collect" className="scroll-mt-8 space-y-3.5">
              <h2 className="text-2xl font-serif font-bold text-[#1E293B]">
                2. Information We Collect
              </h2>
              <div className="text-[13px] sm:text-sm text-[#475569] leading-relaxed space-y-3">
                <p>
                  To access Noltra.ai, you must create an account using accurate and up-to-date information. You are responsible for maintaining the security of your account and for all activities performed under it.
                </p>
                <p>As a user, you agree to:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-[13px] sm:text-sm text-[#475569]">
                  <li>Provide accurate registration information.</li>
                  <li>Keep your login credentials secure.</li>
                  <li>Manage team member access responsibly.</li>
                  <li>Notify us immediately if you suspect unauthorized access.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="how-we-use" className="scroll-mt-8 space-y-3.5">
              <h2 className="text-2xl font-serif font-bold text-[#1E293B]">
                3. How We Use Your Information
              </h2>
              <div className="text-[13px] sm:text-sm text-[#475569] leading-relaxed space-y-3">
                <p>
                  Noltra.ai is designed to support legitimate business operations and productivity. Users must use the platform responsibly and in compliance with applicable laws. You agree not to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[13px] sm:text-sm text-[#475569]">
                  <li>Use the platform for illegal or fraudulent activities.</li>
                  <li>Upload malicious software or harmful content.</li>
                  <li>Attempt unauthorized access to any account or system.</li>
                  <li>Interfere with the platform&apos;s security or performance.</li>
                  <li>Misuse AI-generated content in violation of applicable laws.</li>
                </ul>
                <p>
                  Violation of these rules may result in temporary suspension or permanent termination of your account.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="children-data" className="scroll-mt-8 space-y-3.5">
              <h2 className="text-2xl font-serif font-bold text-[#1E293B]">
                4. Children&apos;s Data &amp; Uploaded Photos
              </h2>
              <div className="text-[13px] sm:text-sm text-[#475569] leading-relaxed">
                <p>
                  Our products are designed for children but must be used by a parent, guardian, or authorised adult. Photos and information about a child are used only to create the personalised product you request. We do not intentionally collect personal information from children without adult consent.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="ai-processing" className="scroll-mt-8 space-y-3.5">
              <h2 className="text-2xl font-serif font-bold text-[#1E293B]">
                5. AI Processing
              </h2>
              <div className="text-[13px] sm:text-sm text-[#475569] leading-relaxed">
                <p>
                  We use AI technology to create personalised story text, illustrations, and related content. Your uploaded photos and personalisation details are processed only for the purpose of generating your book. We do not use your content to train AI models or for advertising purposes.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="data-sharing" className="scroll-mt-8 space-y-3.5">
              <h2 className="text-2xl font-serif font-bold text-[#1E293B]">
                6. Data Sharing
              </h2>
              <div className="text-[13px] sm:text-sm text-[#475569] leading-relaxed">
                <p>
                  We do not sell your personal information. We may share information with trusted service providers (such as payment processors, printing partners, and hosting providers) only when necessary to operate our services.
                </p>
              </div>
            </section>
          </main>
        </div>

        {/* Bottom Banner Card */}
        <div className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EB7F96] via-[#E8738D] to-[#E56884] p-6 sm:p-10 shadow-sm text-white">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Graphics & Heading */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Illustrated badges & playful elements */}
              <div className="relative flex items-center shrink-0">
                {/* Yellow Cute Character Card */}
                <div className="w-12 h-14 bg-[#FDE68A] rounded-xl shadow-md flex flex-col items-center justify-center p-1 border-2 border-white/80 transform -rotate-6 z-10">
                  <div className="text-base">🐻</div>
                  <span className="text-[7px] text-[#92400E] font-bold mt-1">NOLLIE</span>
                </div>
                
                {/* Cyan Illustrated Story Book Card */}
                <div className="w-14 h-16 bg-[#BAE6FD] rounded-xl shadow-md flex flex-col items-center justify-between p-1.5 border-2 border-white/80 transform rotate-3 -ml-3 z-20">
                  <div className="w-6 h-6 rounded-full bg-[#FBBF24] flex items-center justify-center text-[10px]">
                    😊
                  </div>
                  <div className="bg-[#FBBF24] text-[6px] font-bold px-1.5 py-0.5 rounded text-[#78350F] uppercase tracking-tighter">
                    Story Book
                  </div>
                </div>

                {/* Pink 3D Box Illustration behind */}
                <div className="w-10 h-12 bg-[#F43F5E]/60 rounded-lg -ml-4 transform rotate-12 flex items-center justify-center text-xs opacity-80">
                  🎁
                </div>

                {/* Decorative Swirly Arrow */}
                <svg
                  className="hidden sm:block w-20 h-10 text-white/80 ml-2"
                  viewBox="0 0 100 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M 0 25 C 20 5, 30 45, 50 25 C 65 10, 75 35, 90 25" />
                  <polyline points="85 18 92 25 84 31" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  Questions about this Policy?
                </h3>
                <p className="text-white/90 text-xs sm:text-sm mt-1">
                  Our team is happy to help clarify any section before you sign up.
                </p>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="shrink-0">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white text-[#1F2937] hover:bg-slate-50 transition-colors px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#4B5563]" />
                Contact Privacy Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}