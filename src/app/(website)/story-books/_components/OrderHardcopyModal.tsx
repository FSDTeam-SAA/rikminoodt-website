"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Euro, Loader2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface OrderHardcopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  coverImage: string;
}

const HARDCOPY_PRICE_PER_COPY = 34.6;

// Display-only: the server calculates the real shipping fee from the country.
const SHIPPING_FEES = { Belgium: 3.5, France: 5.5, Netherlands: 3.5, UK: 5.5 } as const;
type ShippingCountry = keyof typeof SHIPPING_FEES;
const SHIPPING_COUNTRIES = Object.keys(SHIPPING_FEES) as ShippingCountry[];

const hardcopyCopy = {
  en: {
    shippingHint: "Select a country to see the shipping fee",
    name: "Full Name", namePlaceholder: "e.g. Jane Doe", selectCountry: "Select a country", subtotal: "Books:", shippingFee: "Shipping:", countries: { Belgium: "Belgium", France: "France", Netherlands: "Netherlands", UK: "United Kingdom" },
    close: "Close modal", title: "Order Hardcopy Book", subtitle: "Have your personalised premium hardcover storybook delivered to your address.", edition: "Hardcover Edition", copy: "copy", quantity: "Quantity", shipping: "Shipping Address", line1: "Address Line 1", line2: "Address Line 2 (Optional)", city: "City", state: "State / Province (Optional)", zip: "Postal / Zip Code", country: "Country", countryValue: "Netherlands", line1Placeholder: "e.g. 123 Main Street", line2Placeholder: "Apartment, suite, unit, etc.", cityPlaceholder: "e.g. Amsterdam", statePlaceholder: "e.g. North Holland", zipPlaceholder: "e.g. 1012AB", countryPlaceholder: "e.g. Netherlands", total: "Total Amount:", preparing: "Preparing Checkout…", checkout: "Continue to Checkout", requiredAddress: "Please fill in all required shipping address fields.", signIn: "Please sign in to order a hardcopy book.", checkoutError: "Checkout error occurred", checkoutFailed: "Failed to create checkout session.", checkoutUrlMissing: "No checkout URL returned from server.", decrease: "Decrease quantity", increase: "Increase quantity",
  },
  nl: {
    shippingHint: "Kies een land om de verzendkosten te zien",
    name: "Volledige naam", namePlaceholder: "bijv. Jan Jansen", selectCountry: "Kies een land", subtotal: "Boeken:", shippingFee: "Verzendkosten:", countries: { Belgium: "België", France: "Frankrijk", Netherlands: "Nederland", UK: "Verenigd Koninkrijk" },
    close: "Modal sluiten", title: "Bestel een hardcover boek", subtitle: "Laat jouw persoonlijke premium hardcover verhalenboek bij je thuis bezorgen.", edition: "Hardcover editie", copy: "exemplaar", quantity: "Aantal", shipping: "Verzendadres", line1: "Adresregel 1", line2: "Adresregel 2 (optioneel)", city: "Plaats", state: "Provincie (optioneel)", zip: "Postcode", country: "Land", countryValue: "Dutch", line1Placeholder: "bijv. Hoofdstraat 123", line2Placeholder: "Appartement, verdieping, unit, enz.", cityPlaceholder: "bijv. Amsterdam", statePlaceholder: "bijv. Noord-Holland", zipPlaceholder: "bijv. 1012AB", countryPlaceholder: "bijv. Dutch", total: "Totaalbedrag:", preparing: "Betaling voorbereiden…", checkout: "Doorgaan naar betalen", requiredAddress: "Vul alle verplichte velden van het verzendadres in.", signIn: "Log in om een hardcover boek te bestellen.", checkoutError: "Er is een fout opgetreden bij het afrekenen", checkoutFailed: "Kan geen betaalsessie maken.", checkoutUrlMissing: "Geen betaallink ontvangen.", decrease: "Aantal verlagen", increase: "Aantal verhogen",
  },
  fr: {
    shippingHint: "Choisissez un pays pour voir les frais de livraison",
    name: "Nom complet", namePlaceholder: "ex. Jeanne Dupont", selectCountry: "Choisir un pays", subtotal: "Livres :", shippingFee: "Livraison :", countries: { Belgium: "Belgique", France: "France", Netherlands: "Pays-Bas", UK: "Royaume-Uni" },
    close: "Fermer la fenêtre", title: "Commander un livre relié", subtitle: "Recevez votre livre d'histoires relié personnalisé premium à votre adresse.", edition: "Édition reliée", copy: "exemplaire", quantity: "Quantité", shipping: "Adresse de livraison", line1: "Adresse ligne 1", line2: "Adresse ligne 2 (facultatif)", city: "Ville", state: "Région / province (facultatif)", zip: "Code postal", country: "Pays", countryValue: "France", line1Placeholder: "ex. 123 rue Principale", line2Placeholder: "Appartement, étage, unité, etc.", cityPlaceholder: "ex. Amsterdam", statePlaceholder: "ex. Hollande-Septentrionale", zipPlaceholder: "ex. 1012AB", countryPlaceholder: "ex. France", total: "Montant total :", preparing: "Préparation du paiement…", checkout: "Passer au paiement", requiredAddress: "Remplissez tous les champs obligatoires de l'adresse de livraison.", signIn: "Connectez-vous pour commander un livre relié.", checkoutError: "Une erreur est survenue lors du paiement", checkoutFailed: "Impossible de créer la session de paiement.", checkoutUrlMissing: "Aucun lien de paiement reçu.", decrease: "Diminuer la quantité", increase: "Augmenter la quantité",
  },
} as const;

export default function OrderHardcopyModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  coverImage,
}: OrderHardcopyModalProps) {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const copy = hardcopyCopy[language] || hardcopyCopy.en;
  const [quantity, setQuantity] = useState(1);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lock the page behind the modal so the wheel/touch scrolls the form instead.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !SHIPPING_COUNTRIES.includes(country as ShippingCountry) || !line1.trim() || !city.trim() || !zip.trim() || !country.trim()) {
      setError(copy.requiredAddress);
      return;
    }

    const token =
      session?.user?.accessToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!token) {
      setError(copy.signIn);
      return;
    }

    setLoading(true);
    try {
      const apiBase = getApiBaseUrl();

      // 1. Ensure this book and quantity are set in user's cart (backend print checkout checks cart.items)
      try {
        await fetch(`${apiBase}/cart`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetch(`${apiBase}/cart/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId,
            quantity,
          }),
        });
      } catch (cartErr) {
        console.warn("Cart setup notice:", cartErr);
      }

      // 2. Call print checkout endpoint
      const payload = {
        bookId,
        quantity,
        shippingAddress: {
          name: name.trim(),
          line1: line1.trim(),
          ...(line2.trim() ? { line2: line2.trim() } : {}),
          city: city.trim(),
          ...(state.trim() ? { state: state.trim() } : {}),
          zip: zip.trim(),
          country: country.trim(),
        },
      };

      const res = await fetch(`${apiBase}/payments/print/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || copy.checkoutFailed);
      }

      const checkoutUrl = json?.data?.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error(copy.checkoutUrlMissing);
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("last_payment_type", "print");
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.checkoutError);
      setLoading(false);
    }
  };

  const countryKey = SHIPPING_COUNTRIES.includes(country as ShippingCountry) ? (country as ShippingCountry) : null;
  const booksPrice = quantity * HARDCOPY_PRICE_PER_COPY;
  const shippingPrice = countryKey ? SHIPPING_FEES[countryKey] : null;
  const totalPrice = (booksPrice + (shippingPrice ?? 0)).toFixed(2);

  const inputCls =
    "w-full rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-2.5 font-sans text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25 sm:text-sm";
  const labelCls = "mb-1 block font-sans text-xs font-medium text-[#444444]";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-hardcopy-title"
      onClick={onClose}
    >
      <form
        onSubmit={handleCheckout}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[#FBE5EC] bg-[#FFFDFB] shadow-[0_24px_60px_rgba(60,30,50,0.22)]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label={copy.close}
          className="absolute right-3.5 top-3.5 z-20 flex size-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
        >
          <X size={20} />
        </button>

        {/* Scrollable Form Body with visible branded scrollbar */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-6 sm:px-8 sm:pt-7 [scrollbar-width:thin] [scrollbar-color:#F3A8B7_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F3A8B7]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#E88DA0]">
          {/* Modal Header */}
          <div className="mb-6 rounded-2xl bg-[linear-gradient(110deg,#FFF1F4,#FFF9F1)] px-4 py-4 pr-12 sm:px-5">
            <h2 id="order-hardcopy-title" className="font-crimson text-2xl font-bold text-[#51274A] sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-1 font-sans text-xs text-[#66605F] sm:text-sm">{copy.subtitle}</p>
          </div>

          {/* Book Mini Summary */}
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#F3A8B7]/60 bg-white p-4 shadow-[0_4px_14px_rgba(92,76,84,0.08)]">
            <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-md bg-[#f9edf0] shadow">
              {coverImage ? (
                <Image src={coverImage} alt={bookTitle} fill unoptimized className="object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-crimson text-base font-semibold text-[#1E1E1E]">{bookTitle}</h3>
              <p className="mt-1 text-xs text-[#8A7982]">
                {copy.edition} • €{HARDCOPY_PRICE_PER_COPY.toFixed(2)} / {copy.copy}
              </p>
            </div>
          </div>

          {error && (
            <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Quantity Selector */}
            <div>
              <label className="mb-1.5 block font-sans text-xs font-semibold text-[#444444] sm:text-sm">{copy.quantity}</label>
              <div className="flex w-fit items-center gap-3 rounded-xl border border-[#F3A8B7] bg-white p-1">
                <button
                  type="button"
                  disabled={quantity <= 1 || loading}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label={copy.decrease}
                  className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-[#FFF0F3] disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center font-sans text-sm font-semibold text-[#1E1E1E]">{quantity}</span>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label={copy.increase}
                  className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-[#FFF0F3]"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#8A7982]">{copy.shipping}</h4>
            </div>

            <div>
              <label className={labelCls}>{copy.name} <span className="text-red-500">*</span></label>
              <input type="text" required disabled={loading} value={name} onChange={(e) => setName(e.target.value)} placeholder={copy.namePlaceholder} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>{copy.line1} <span className="text-red-500">*</span></label>
              <input type="text" required disabled={loading} value={line1} onChange={(e) => setLine1(e.target.value)} placeholder={copy.line1Placeholder} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>{copy.line2}</label>
              <input type="text" disabled={loading} value={line2} onChange={(e) => setLine2(e.target.value)} placeholder={copy.line2Placeholder} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{copy.city} <span className="text-red-500">*</span></label>
                <input type="text" required disabled={loading} value={city} onChange={(e) => setCity(e.target.value)} placeholder={copy.cityPlaceholder} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{copy.state}</label>
                <input type="text" disabled={loading} value={state} onChange={(e) => setState(e.target.value)} placeholder={copy.statePlaceholder} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{copy.zip} <span className="text-red-500">*</span></label>
                <input type="text" required disabled={loading} value={zip} onChange={(e) => setZip(e.target.value)} placeholder={copy.zipPlaceholder} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{copy.country} <span className="text-red-500">*</span></label>
                <select required disabled={loading} value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                  <option value="" disabled>{copy.selectCountry}</option>
                  {SHIPPING_COUNTRIES.map((code) => (
                    <option key={code} value={code}>{copy.countries[code]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="mt-4 rounded-xl bg-[#FBF3EA] p-3 text-sm">
              <div className="flex items-center justify-between font-sans text-xs text-[#66605F] sm:text-sm">
                <span>{copy.subtotal}</span>
                <span>€{booksPrice.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3 font-sans text-xs text-[#66605F] sm:text-sm">
                <span>{copy.shippingFee}</span>
                {shippingPrice === null ? (
                  <span className="text-right text-[11px] italic text-[#8A7982] sm:text-xs">{copy.shippingHint}</span>
                ) : (
                  <span>€{shippingPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[#EBDCCB] pt-2">
                <span className="font-sans font-medium text-[#514256]">{copy.total}</span>
                <span className="inline-flex items-center gap-1 font-crimson text-xl font-bold text-[#E88DA0]">
                  <Euro className="size-4" strokeWidth={2.5} aria-hidden="true" />
                  {totalPrice}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 border-t border-[#F3E3E8] bg-[#FFFDFB] px-5 py-4 sm:px-8">
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#DD7893] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{copy.preparing}</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>{copy.checkout}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
