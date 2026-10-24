"use client";

import { useEffect } from "react";
import { Loader2, LogOut, X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface LogoutConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

export default function LogoutConfirmationModal({
  open,
  onClose,
  onConfirm,
  isLoggingOut = false,
}: LogoutConfirmationModalProps) {
  const { t } = useLanguage();
  const copy = t.nav;

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoggingOut) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isLoggingOut, onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#302530]/45 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => {
        if (!isLoggingOut) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(48,37,48,0.32)] sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#D94868]">
            <LogOut size={23} aria-hidden="true" />
          </div>
          <button
            type="button"
            aria-label={t.settings.general.cancel}
            disabled={isLoggingOut}
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8A7180] transition hover:bg-[#FFF0F3] hover:text-[#D94868] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <h2 id="logout-modal-title" className="mt-5 font-crimson text-3xl font-semibold text-[#302530]">
          {copy.logoutConfirmationTitle}
        </h2>
        <p id="logout-modal-description" className="mt-2 font-sans text-sm leading-relaxed text-[#6D5B66]">
          {copy.logoutConfirmationDescription}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onClose}
            className="min-h-11 rounded-xl border border-[#E8D4DB] px-5 font-sans text-sm font-semibold text-[#6D5B66] transition hover:bg-[#FFF7F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] disabled:opacity-50"
          >
            {t.settings.general.cancel}
          </button>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D94868] px-5 font-sans text-sm font-semibold text-white transition hover:bg-[#C43252] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94868] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <LogOut size={17} aria-hidden="true" />}
            {copy.confirmLogout}
          </button>
        </div>
      </section>
    </div>
  );
}
