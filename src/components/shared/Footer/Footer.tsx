import Image from "next/image";
import Link from "next/link";

import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const footerGroups = [
  { title: "Discover", links: ["Book Themes", "Examples", "Pricing", "How it works", "Create your Book"] },
  { title: "Occasions", links: ["Birthday", "Christmas", "New Baby", "First day of school", "Just Because"] },
  { title: "Help", links: ["FAQs", "Contact Us", "Terms & Conditions", "Privacy Policy"] },
];

const socialLinks = [
  { label: "Facebook", icon: FaFacebookF },
  { label: "Instagram", icon: FaInstagram },
  { label: "TikTok", icon: FaTiktok },
];

const toAnchor = (label: string) => `#${label.toLowerCase().replaceAll(" ", "-")}`;

const Footer = () => {
  return (
      <footer className="bg-[#4A3F52] text-white">
        <div className="container mx-auto px-6 py-11 sm:px-8 sm:py-12 lg:min-h-[407px] lg:px-0 lg:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[396px_repeat(3,max-content)] lg:justify-between lg:gap-8">
            <section className="max-w-[310px]">
            <Link
              href="#"
                aria-label="Bookereillo home"
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
                Bookereillo personalized storybooks that turn your child&apos;s imagination into magical adventure.
            </p>
              <nav aria-label="Social media" className="mt-4 flex items-center gap-3">
                {socialLinks.map(({ label, icon: Icon }) => (
                  <Link key={label} href="#" aria-label={label} className="flex size-7 items-center justify-center rounded-md text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eea0b4]">
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
                      <Link href={toAnchor(link)} className="group inline-flex items-center gap-1.5 text-sm text-white/90 transition hover:text-[#f6bdca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eea0b4] lg:text-base">
                        <span aria-hidden="true" className="text-[9px] transition-transform group-hover:translate-x-0.5">▸</span>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
            </nav>
          ))}
        </div>

          <div className="mt-9 border-t border-white/30 pt-5 text-center text-sm text-white/90 sm:mt-11 lg:mt-8 lg:text-base">
            © {new Date().getFullYear()} Bookereillo . All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
