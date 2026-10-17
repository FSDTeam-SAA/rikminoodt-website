import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ChangePasswordProps {
  onViewChange: (view: "list" | "password" | "delete") => void;
}

const fields = [
  { id: "current-password", label: "Current Password", autoComplete: "current-password" },
  { id: "new-password", label: "New Password", autoComplete: "new-password" },
  { id: "confirm-password", label: "Confirm Password", autoComplete: "new-password" },
] as const;

export default function ChangePasswordView({ onViewChange }: ChangePasswordProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-sans text-base font-medium text-[#1E1E1E]">Change Password</h2>
        <button type="button" onClick={() => onViewChange("list")} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium text-[#E3859A] transition hover:bg-[#FFF0F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]">
          <ArrowLeft aria-hidden="true" size={16} /> Back
        </button>
      </div>
      <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); onViewChange("list"); }}>
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-2 block font-sans text-sm text-[#444444]">{field.label}</label>
            <div className="relative">
              <input
                id={field.id}
                type={visible[field.id] ? "text" : "password"}
                autoComplete={field.autoComplete}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#F3A8B7] bg-white px-4 py-3 pr-12 font-sans text-sm text-[#444444] outline-none placeholder:text-gray-400 placeholder:text-base placeholder:tracking-widest focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25"
              />
              <button type="button" onClick={() => setVisible((current) => ({ ...current, [field.id]: !current[field.id] }))} aria-label={`${visible[field.id] ? "Hide" : "Show"} ${field.label.toLowerCase()}`} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]">
                {visible[field.id] ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <button type="submit" className="rounded-xl bg-[#E3859A] px-10 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-[#d67288]">Save</button>
        </div>
      </form>
    </div>
  );
}
