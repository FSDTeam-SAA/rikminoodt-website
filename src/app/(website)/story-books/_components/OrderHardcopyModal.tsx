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

const hardcopyCopy = {
  en: {
    close: "Close modal", title: "Order Hardcopy Book", subtitle: "Have your personalised premium hardcover storybook delivered to your address.", edition: "Hardcover Edition", copy: "copy", quantity: "Quantity", shipping: "Shipping Address", line1: "Address Line 1", line2: "Address Line 2 (Optional)", city: "City", state: "State / Province", zip: "Postal / Zip Code", country: "Country", countryValue: "Netherlands", line1Placeholder: "e.g. 123 Main Street", line2Placeholder: "Apartment, suite, unit, etc.", cityPlaceholder: "e.g. Amsterdam", statePlaceholder: "e.g. North Holland", zipPlaceholder: "e.g. 1012AB", countryPlaceholder: "e.g. Netherlands", total: "Total Amount:", preparing: "Preparing Checkout…", checkout: "Continue to Checkout", requiredAddress: "Please fill in all required shipping address fields.", signIn: "Please sign in to order a hardcopy book.", checkoutError: "Checkout error occurred", checkoutFailed: "Failed to create checkout session.", checkoutUrlMissing: "No checkout URL returned from server.", decrease: "Decrease quantity", increase: "Increase quantity",
  },
  nl: {
    close: "Modal sluiten", title: "Bestel een hardcover boek", subtitle: "Laat jouw persoonlijke premium hardcover verhalenboek bij je thuis bezorgen.", edition: "Hardcover editie", copy: "exemplaar", quantity: "Aantal", shipping: "Verzendadres", line1: "Adresregel 1", line2: "Adresregel 2 (optioneel)", city: "Plaats", state: "Provincie", zip: "Postcode", country: "Land", countryValue: "Dutch", line1Placeholder: "bijv. Hoofdstraat 123", line2Placeholder: "Appartement, verdieping, unit, enz.", cityPlaceholder: "bijv. Amsterdam", statePlaceholder: "bijv. Noord-Holland", zipPlaceholder: "bijv. 1012AB", countryPlaceholder: "bijv. Dutch", total: "Totaalbedrag:", preparing: "Betaling voorbereiden…", checkout: "Doorgaan naar betalen", requiredAddress: "Vul alle verplichte velden van het verzendadres in.", signIn: "Log in om een hardcover boek te bestellen.", checkoutError: "Er is een fout opgetreden bij het afrekenen", checkoutFailed: "Kan geen betaalsessie maken.", checkoutUrlMissing: "Geen betaallink ontvangen.", decrease: "Aantal verlagen", increase: "Aantal verhogen",
  },
  fr: {
    close: "Fermer la fenêtre", title: "Commander un livre relié", subtitle: "Recevez votre livre d'histoires relié personnalisé premium à votre adresse.", edition: "Édition reliée", copy: "exemplaire", quantity: "Quantité", shipping: "Adresse de livraison", line1: "Adresse ligne 1", line2: "Adresse ligne 2 (facultatif)", city: "Ville", state: "Région / province", zip: "Code postal", country: "Pays", countryValue: "France", line1Placeholder: "ex. 123 rue Principale", line2Placeholder: "Appartement, étage, unité, etc.", cityPlaceholder: "ex. Amsterdam", statePlaceholder: "ex. Hollande-Septentrionale", zipPlaceholder: "ex. 1012AB", countryPlaceholder: "ex. France", total: "Montant total :", preparing: "Préparation du paiement…", checkout: "Passer au paiement", requiredAddress: "Remplissez tous les champs obligatoires de l'adresse de livraison.", signIn: "Connectez-vous pour commander un livre relié.", checkoutError: "Une erreur est survenue lors du paiement", checkoutFailed: "Impossible de créer la session de paiement.", checkoutUrlMissing: "Aucun lien de paiement reçu.", decrease: "Diminuer la quantité", increase: "Augmenter la quantité",
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
  const [country, setCountry] = useState("Dutch");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCountry((currentCountry) =>
      ["Netherlands", "Dutch", "France"].includes(currentCountry)
        ? copy.countryValue
        : currentCountry,
    );
  }, [copy.countryValue]);

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!line1.trim() || !city.trim() || !state.trim() || !zip.trim() || !country.trim()) {
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
          line1: line1.trim(),
          ...(line2.trim() ? { line2: line2.trim() } : {}),
          city: city.trim(),
          state: state.trim(),
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

  const totalPrice = (quantity * HARDCOPY_PRICE_PER_COPY).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-hardcopy-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-[#F3A8B7]/40 bg-[#FEFAF4] p-5 shadow-[0_24px_70px_rgba(68,42,62,0.28)] sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label={copy.close}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 rounded-2xl bg-[linear-gradient(110deg,#FFF1F4,#FFF9F1)] px-4 py-4 pr-12 sm:px-5">
          <h2 id="order-hardcopy-title" className="font-crimson text-2xl font-bold text-[#51274A] sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-1 font-sans text-xs text-[#66605F] sm:text-sm">
            {copy.subtitle}
          </p>
        </div>

        {/* Book Mini Summary */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#F3A8B7]/60 bg-white p-4 shadow-[0_4px_14px_rgba(92,76,84,0.08)]">
          <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-md bg-[#f9edf0] shadow">
            {coverImage ? (
              <Image src={coverImage} alt={bookTitle} fill unoptimized className="object-cover" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-crimson text-base font-semibold text-[#1E1E1E]">
              {bookTitle}
            </h3>
            <p className="mt-1 text-xs text-[#8A7982]">{copy.edition} • €{HARDCOPY_PRICE_PER_COPY.toFixed(2)} / {copy.copy}</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckout} className="space-y-4">
          {/* Quantity Selector */}
          <div>
            <label className="mb-1.5 block font-sans text-xs font-semibold text-[#444444] sm:text-sm">
              {copy.quantity}
            </label>
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
              <span className="w-8 text-center font-sans text-sm font-semibold text-[#1E1E1E]">
                {quantity}
              </span>
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

          {/* Shipping Address Header */}
          <div className="pt-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#8A7982]">
              {copy.shipping}
            </h4>
          </div>

          {/* Line 1 */}
          <div>
            <label className="mb-1 block font-sans text-xs font-medium text-[#444444]">
              {copy.line1} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder={copy.line1Placeholder}
              className="w-full rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-2.5 font-sans text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25 sm:text-sm"
            />
          </div>

          {/* Line 2 */}
          <div>
            <label className="mb-1 block font-sans text-xs font-medium text-[#444444]">
              {copy.line2}
            </label>
            <input
              type="text"
              disabled={loading}
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              placeholder={copy.line2Placeholder}
              className="w-full rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-2.5 font-sans text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25 sm:text-sm"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-sans text-xs font-medium text-[#444444]">
                {copy.city} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={copy.cityPlaceholder}
                className="w-full rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-2.5 font-sans text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25 sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-xs font-medium text-[#444444]">
                {copy.state} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={copy.statePlaceholder}
                className="w-full rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-2.5 font-sans text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25 sm:text-sm"
              />
            </div>
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-sans text-xs font-medium text-[#444444]">
                {copy.zip} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder={copy.zipPlaceholder}
                className="w-full rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-2.5 font-sans text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25 sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-xs font-medium text-[#444444]">
                {copy.country} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={copy.countryPlaceholder}
                className="w-full rounded-xl border border-[#F3A8B7] bg-white px-3.5 py-2.5 font-sans text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25 sm:text-sm"
              />
            </div>
          </div>

          {/* Total Price Bar */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FBF3EA] p-3 text-sm">
            <span className="font-sans font-medium text-[#514256]">{copy.total}</span>
            <span className="inline-flex items-center gap-1 font-crimson text-xl font-bold text-[#E88DA0]">
              <Euro className="size-4" strokeWidth={2.5} aria-hidden="true" />
              {totalPrice}
            </span>
          </div>

          {/* Submit Checkout Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E88DA0] font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#DD7893] disabled:opacity-60"
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
    </div>
  );
}
