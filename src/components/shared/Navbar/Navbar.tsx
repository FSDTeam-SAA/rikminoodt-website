"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Story Books", href: "#story-books" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeMenu);
    return () => window.removeEventListener("keydown", closeMenu);
  }, []);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 12);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-0 pointer-events-none">
      <div
        className={`pointer-events-auto absolute inset-x-0 top-0 px-3 transition-[padding] duration-300 sm:px-6 lg:px-0 ${
          isScrolled ? "pt-2 sm:pt-3 lg:pt-4" : "pt-3 sm:pt-5 lg:pt-11"
        }`}
      >
        <div
          className={`container mx-auto max-w-[1280px] rounded-[105px] transition-[background-color,box-shadow] duration-300 lg:px-0 ${
            isScrolled ? "bg-white/90 shadow-[0_8px_24px_rgba(74,63,82,0.16)]" : "bg-white/40"
          }`}
        >
        <div className="flex min-h-[58px] items-center justify-between gap-3 px-4 sm:px-6 lg:min-h-[81px] lg:px-10">
          <Link
            href="/"
            aria-label="Bookereillo home"
            className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
          >
            <Image
              src="/images/logo.png"
              alt="Bookereillo"
              width={198}
              height={57}
              priority
              className="h-auto w-[126px] sm:w-[142px] lg:w-[198px]"
            />
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => {
              const isActive = item.href === "/" && pathname === "/";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-2 font-crimson text-xl font-semibold transition-colors hover:text-[#e77f9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] ${
                    isActive ? "text-[#e77f9a]" : "text-[#5d5059]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 mx-auto h-px bg-[#e77f9a] transition-transform ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 sm:flex lg:gap-6">
            <Image src="/images/flag.png" alt="United States" width={36} height={36} className="size-8 object-contain lg:size-9" />
            <Link
              href="#cart"
              aria-label="View shopping cart"
              className="flex size-9 items-center justify-center rounded-full text-[#5a5358] transition hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] lg:size-10"
            >
              <ShoppingCart aria-hidden="true" size={26} strokeWidth={1.4} />
            </Link>
            <Link
              href="#account"
              aria-label="Open your account"
              className="rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
            >
              <Image src="/images/profile.png" alt="Your profile" width={40} height={40} className="size-8 rounded-full object-cover lg:size-9" />
            </Link>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full text-[#584b55] transition hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] lg:hidden"
          >
            {isMenuOpen ? <X aria-hidden="true" size={23} /> : <Menu aria-hidden="true" size={25} />}
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={`overflow-hidden border-t border-[#876d7c]/10 transition-[max-height,opacity] duration-300 lg:hidden ${
            isMenuOpen ? "max-h-[370px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <nav aria-label="Mobile navigation" className="flex flex-col px-4 py-3 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#5d5059] transition hover:bg-white/75 hover:text-[#e77f9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-[#876d7c]/10 pt-3 sm:hidden">
              <Link href="#cart" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-white/75 text-sm font-medium text-[#5d5059]">
                <ShoppingCart aria-hidden="true" size={18} /> Cart
              </Link>
              <Link href="#account" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#f8e6eb] px-3 text-sm font-medium text-[#a15971]">
                <Image src="/images/profile.png" alt="" width={22} height={22} className="size-5 rounded-full" /> Account
              </Link>
            </div>
          </nav>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
