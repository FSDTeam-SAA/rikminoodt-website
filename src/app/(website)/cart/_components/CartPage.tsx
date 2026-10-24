"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export type CartBook = {
  id: string;
  title: string;
  image: string;
  format: string;
  price: number;
  quantity: number;
};

type CartPageProps = {
  isSignedIn?: boolean;
  books?: CartBook[];
};

const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-xl px-6 font-sans text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2";

const cartCopy = {
  en: { title: "Cart", empty: "Your cart is empty", login: "Log in to view your cart", addBook: "Add Book", logIn: "Log in", createNew: "Create a new book", createBook: "Create a children's book", yourBooks: "Your books", quantity: "Quantity", addAnother: "Add another book", summary: "Order summary", total: "Total", checkout: "Continue to checkout", cover: "Cover of" },
  nl: { title: "Winkelwagen", empty: "Je winkelwagen is leeg", login: "Log in om je winkelwagen te bekijken", addBook: "Boek toevoegen", logIn: "Inloggen", createNew: "Een nieuw boek maken", createBook: "Een kinderboek maken", yourBooks: "Jouw boeken", quantity: "Aantal", addAnother: "Nog een boek toevoegen", summary: "Besteloverzicht", total: "Totaal", checkout: "Doorgaan naar afrekenen", cover: "Omslag van" },
  fr: { title: "Panier", empty: "Votre panier est vide", login: "Connectez-vous pour voir votre panier", addBook: "Ajouter un livre", logIn: "Se connecter", createNew: "Créer un nouveau livre", createBook: "Créer un livre pour enfants", yourBooks: "Vos livres", quantity: "Quantité", addAnother: "Ajouter un autre livre", summary: "Récapitulatif de la commande", total: "Total", checkout: "Continuer vers le paiement", cover: "Couverture de" },
};

export default function CartPage({ isSignedIn = false, books = [] }: CartPageProps) {
  const { language } = useLanguage();
  const copy = cartCopy[language];
  const total = books.reduce((sum, book) => sum + book.price * book.quantity, 0);
  const formatPrice = (amount: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);

  return (
    <main className="relative min-h-[520px] overflow-hidden bg-[#FBF3EA] px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-16 lg:pt-20">
      <Image src="/images/cloud.png" alt="" width={160} height={107} className="pointer-events-none absolute right-4 top-8 hidden h-auto w-28 opacity-70 sm:right-8 sm:top-10 sm:block sm:w-36" />
      <Image src="/images/parasut.png" alt="" width={110} height={130} className="pointer-events-none absolute bottom-4 left-4 hidden h-auto w-16 opacity-80 sm:bottom-6 sm:left-8 sm:block sm:w-20" />
      <section aria-labelledby="cart-heading" className="relative mx-auto max-w-[1120px]">
        <h1 id="cart-heading" className="font-sans text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">{copy.title}</h1>
        {!isSignedIn || books.length === 0 ? (
          <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white px-5 py-12 text-center shadow-[0_3px_15px_rgba(104,78,71,0.05)] sm:min-h-[360px]">
            <span className="flex size-14 items-center justify-center rounded-full border border-[#FFD1BE] bg-[#FFF7F2] text-[#E88DA0]"><ShoppingBag size={22} aria-hidden="true" /></span>
            <h2 className="mt-5 font-sans text-base font-semibold text-[#1E1E1E] sm:text-lg">{isSignedIn ? copy.empty : copy.login}</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {isSignedIn ? (
                <Link href="/setting/generated-books" className={`${buttonClass} bg-[#E88DA0] hover:bg-[#DD7893]`}>{copy.addBook}</Link>
              ) : (
                <button type="button" disabled className={`${buttonClass} cursor-not-allowed bg-[#9C81BE] opacity-70`}>{copy.logIn}</button>
              )}
              <Link href="/book-builder/choose-age" className={`${buttonClass} ${isSignedIn ? "bg-[#9C81BE] hover:bg-[#8667AD]" : "bg-[#E88DA0] hover:bg-[#DD7893]"}`}>{isSignedIn ? copy.createNew : copy.createBook}</Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl bg-white p-5 shadow-[0_3px_15px_rgba(104,78,71,0.05)] sm:p-7">
              <div className="flex items-center gap-3 border-b border-[#F1E5DE] pb-5"><span className="flex size-10 items-center justify-center rounded-full bg-[#FFF0F3] text-[#E88DA0]"><BookOpen size={19} aria-hidden="true" /></span><h2 className="font-sans text-lg font-semibold text-[#292329]">{copy.yourBooks}</h2></div>
              <ul className="divide-y divide-[#F1E5DE]">
                {books.map((book) => (
                  <li key={book.id} className="flex gap-4 py-5 sm:gap-5">
                    <Image src={book.image} alt={`${copy.cover} ${book.title}`} width={100} height={135} className="h-[110px] w-[82px] shrink-0 rounded-md object-cover shadow-sm sm:h-[135px] sm:w-[100px]" />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div><h3 className="font-sans text-base font-semibold text-[#292329] sm:text-lg">{book.title}</h3><p className="mt-2 text-sm text-[#756E73]">{book.format}</p><p className="mt-1 text-sm text-[#756E73]">{copy.quantity}: {book.quantity}</p></div>
                      <p className="font-sans text-base font-bold text-[#514256]">{formatPrice(book.price * book.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/setting/generated-books" className="inline-flex items-center gap-2 text-sm font-semibold text-[#D87990] hover:text-[#B75E78]">{copy.addAnother} <ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
            <aside className="rounded-2xl bg-white p-6 shadow-[0_3px_15px_rgba(104,78,71,0.05)]" aria-labelledby="cart-summary-heading">
              <h2 id="cart-summary-heading" className="font-sans text-lg font-semibold text-[#292329]">{copy.summary}</h2>
              <div className="mt-5 flex items-center justify-between border-t border-[#F1E5DE] pt-5 font-sans text-base font-semibold text-[#514256]"><span>{copy.total}</span><span>{formatPrice(total)}</span></div>
              <button type="button" disabled className="mt-6 flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-xl bg-[#E88DA0] px-5 text-sm font-semibold text-white opacity-70">{copy.checkout}</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
