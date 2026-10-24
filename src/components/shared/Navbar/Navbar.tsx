"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Settings, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/components/providers/LanguageProvider";
import LogoutConfirmationModal from "@/components/shared/LogoutConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getUserInitials(name?: string | null, email?: string | null) {
  const displayName = name?.trim() || email?.split("@")[0]?.trim() || "User";
  const words = displayName.split(/\s+/).filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const Navbar = () => {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = session?.user;
  const userInitials = getUserInitials(user?.name, user?.email);
  const overlaysPageContent =
    pathname === "/" ||
    pathname.startsWith("/book-builder") ||
    pathname === "/pricing" ||
    pathname === "/contact" ||
    pathname === "/contact-us" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms-and-conditions";

  const navigation = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.examples, href: "/examples" },
    { label: t.nav.howItWorks, href: "/how-it-works" },
    { label: t.nav.storyBooks, href: "/story-books" },
    { label: t.nav.pricing, href: "/pricing" },
  ];

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
    let frameId: number | null = null;

    const updateScrolledState = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const nextState = window.scrollY > 12;
        setIsScrolled((currentState) =>
          currentState === nextState ? currentState : nextState,
        );
        frameId = null;
      });
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrolledState);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
    }
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
    <header className={`sticky top-0 z-50 pointer-events-none ${overlaysPageContent ? "h-0" : "h-[78px] sm:h-[88px] lg:h-[116px]"}`}>
      <div
        className={`pointer-events-auto absolute inset-x-0 top-0 transition-[padding] duration-300 ${
          isScrolled ? "pt-2 sm:pt-3 lg:pt-4" : "pt-3 sm:pt-5 lg:pt-11"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-5 lg:px-0">
          <div
            className={`overflow-visible rounded-[28px] border border-white/60 backdrop-blur-md transition-[background-color,box-shadow] duration-300 sm:rounded-[32px] ${
              isScrolled || isMenuOpen
                ? "bg-white/95 shadow-[0_8px_24px_rgba(74,63,82,0.16)]"
                : "bg-white/80 shadow-[0_4px_16px_rgba(74,63,82,0.08)]"
            }`}
          >
        <div className="flex min-h-[54px] items-center justify-between gap-3 px-4 sm:min-h-[58px] sm:px-6 lg:min-h-[72px] lg:px-8">
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
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-2 font-fredoka text-lg font-normal transition-colors hover:text-[#e77f9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] ${
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

          <div className="hidden items-center gap-3 sm:flex lg:gap-5">
            <LanguageSwitcher />
            <Link
              href="/cart"
              aria-label={t.nav.cartAria}
              className="flex size-9 items-center justify-center rounded-full text-[#5a5358] transition hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] lg:size-10"
            >
              <ShoppingCart aria-hidden="true" size={26} strokeWidth={1.4} />
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={t.nav.accountAria}
                  className="group flex size-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2 lg:size-10"
                >
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.name || "Your profile"}
                      width={40}
                      height={40}
                      className="size-8 rounded-full object-cover shadow-[0_2px_6px_rgba(74,63,82,0.15)] transition-shadow duration-200 group-hover:shadow-[0_3px_8px_rgba(232,141,160,0.3)] lg:size-9"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#F8E6EB] font-fredoka text-xs text-[#A15971] shadow-[0_2px_6px_rgba(74,63,82,0.15)] transition-shadow duration-200 group-hover:shadow-[0_3px_8px_rgba(232,141,160,0.3)] lg:size-9 lg:text-sm">
                      {userInitials}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="z-[110] min-w-[200px] overflow-hidden rounded-2xl border border-[#F3A8B7]/60 bg-white/95 p-1.5 shadow-[0_10px_25px_rgba(74,63,82,0.15)] backdrop-blur-md animate-in fade-in-50 zoom-in-95"
                >
                  <div className="flex items-center gap-2.5 px-2.5 py-2">
                    <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8E6EB] font-fredoka text-xs text-[#A15971] shadow-sm">
                      {user.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name || "Profile"}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <div className="flex max-w-[140px] flex-col truncate">
                      <span className="truncate font-fredoka text-sm font-medium text-[#252025]">
                        {user.name || t.nav.account}
                      </span>
                      <span className="truncate text-[11px] text-[#876d7c]">
                        {user.email || ""}
                      </span>
                    </div>
                  </div>

                <DropdownMenuSeparator className="my-1 bg-[#876d7c]/15" />

                <DropdownMenuItem
                  onClick={() => router.push("/setting")}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-[#5d5059] transition-colors hover:bg-[#FFF0F3] hover:text-[#e77f9a]"
                >
                  <Settings size={16} strokeWidth={1.8} className="text-[#876d7c]" />
                  <span>{t.nav.settings}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setLogoutModalOpen(true)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-[#d94868] transition-colors hover:bg-[#FFF0F3] hover:text-[#c43252]"
                >
                  <LogOut size={16} strokeWidth={1.8} className="text-[#d94868]" />
                  <span>{t.nav.logout}</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/book-builder"
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-[#E88DA0] px-4 font-fredoka text-sm text-white shadow-[0_3px_10px_rgba(232,141,160,0.3)] transition-colors hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2 lg:h-10 lg:px-5"
              >
                {t.hero.createBookBtn}
              </Link>
            )}
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
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
          className={`border-t border-[#876d7c]/10 transition-[max-height,opacity] duration-300 lg:hidden ${
            isMenuOpen
              ? "max-h-[calc(100dvh-82px)] overflow-y-auto overscroll-contain opacity-100"
              : "pointer-events-none max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <nav aria-label="Mobile navigation" className="flex flex-col px-4 py-3 sm:px-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-xl px-3 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] ${
                  isActive
                    ? "bg-[#FFF0F3] text-[#e77f9a]"
                    : "text-[#5d5059] hover:bg-white/75 hover:text-[#e77f9a]"
                }`}
              >
                {item.label}
              </Link>
              );
            })}
            <LanguageSwitcher isMobile className="mt-2 border-t border-[#876d7c]/10 pt-2" />
            <div className="mt-2 flex items-center gap-2 border-t border-[#876d7c]/10 pt-3 sm:hidden">
              <Link href="/cart" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-white/75 text-sm font-medium text-[#5d5059]">
                <ShoppingCart aria-hidden="true" size={18} /> {t.nav.cart}
              </Link>
              {user ? <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={t.nav.accountAria}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#f8e6eb] px-3 text-sm font-medium text-[#a15971] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf]"
                >
                  {user.profileImage ? (
                    <Image src={user.profileImage} alt="" width={22} height={22} className="size-5 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-5 items-center justify-center rounded-full bg-white font-fredoka text-[10px] text-[#A15971]">{userInitials}</span>
                  )} {t.nav.account}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={6}
                  className="z-[110] min-w-[190px] overflow-hidden rounded-2xl border border-[#F3A8B7]/60 bg-white/95 p-1.5 shadow-xl backdrop-blur-md"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/setting");
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-[#5d5059] hover:bg-[#FFF0F3] hover:text-[#e77f9a]"
                  >
                    <Settings size={16} strokeWidth={1.8} className="text-[#876d7c]" />
                    <span>{t.nav.settings}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsMenuOpen(false);
                      setLogoutModalOpen(true);
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-[#d94868] hover:bg-[#FFF0F3]"
                  >
                    <LogOut size={16} strokeWidth={1.8} className="text-[#d94868]" />
                    <span>{t.nav.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : (
                <Link
                  href="/book-builder"
                  className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#E88DA0] px-3 text-sm font-semibold text-white shadow-[0_3px_10px_rgba(232,141,160,0.25)] transition-colors hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf]"
                >
                  {t.hero.createBookBtn}
                </Link>
              )}
            </div>
          </nav>
          </div>
        </div>
      </div>
      </div>
    </header>
    <LogoutConfirmationModal
      open={logoutModalOpen}
      isLoggingOut={isLoggingOut}
      onClose={() => setLogoutModalOpen(false)}
      onConfirm={handleLogout}
    />
    </>
  );
};

export default Navbar;
