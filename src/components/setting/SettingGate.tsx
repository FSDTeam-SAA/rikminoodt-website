"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LogIn } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const copyByLanguage = {
  en: {
    title: "Please log in to continue",
    text: "Log in to the account you used for your order to see your books and order status.",
    login: "Log in",
    home: "Back to Home",
  },
  nl: {
    title: "Log in om verder te gaan",
    text: "Log in met het account waarmee je hebt besteld om je boeken en de status van je bestelling te zien.",
    login: "Inloggen",
    home: "Terug naar home",
  },
  fr: {
    title: "Connectez-vous pour continuer",
    text: "Connectez-vous avec le compte utilisé pour votre commande afin de voir vos livres et le statut de votre commande.",
    login: "Se connecter",
    home: "Retour à l’accueil",
  },
} as const;

/**
 * Shows a friendly "please log in" screen (with a redirect back to this page)
 * instead of an empty settings area when the visitor is not signed in,
 * e.g. when they open a link from an email in a fresh browser.
 */
export default function SettingGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { language } = useLanguage();
  const pathname = usePathname();
  const [hasLocalToken, setHasLocalToken] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      setHasLocalToken(Boolean(localStorage.getItem("token")));
    } catch {
      setHasLocalToken(false);
    }
    setSearch(window.location.search);
  }, []);

  const needsLogin = status === "unauthenticated" && hasLocalToken === false;
  if (!needsLogin) return <>{children}</>;

  const copy = copyByLanguage[language as keyof typeof copyByLanguage] || copyByLanguage.en;
  const redirect = encodeURIComponent(`${pathname || "/setting"}${search}`);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#FFE9F0] text-[#FC5A00]">
        <LogIn className="size-7" />
      </div>
      <h1 className="font-sans text-2xl font-bold text-[#1E1E1E]">{copy.title}</h1>
      <p className="mt-2 font-sans text-sm leading-relaxed text-[#66605F]">{copy.text}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/login?redirect=${redirect}`}
          className="inline-flex rounded-xl bg-[#FC5A00] px-6 py-2.5 font-sans text-sm font-semibold text-white transition hover:opacity-90"
        >
          {copy.login}
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-xl border border-[#FC5A00] px-6 py-2.5 font-sans text-sm font-semibold text-[#FC5A00]"
        >
          {copy.home}
        </Link>
      </div>
    </div>
  );
}
