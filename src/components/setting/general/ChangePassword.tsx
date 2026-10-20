"use client";

import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { getApiBaseUrl } from "@/config/api";

interface ChangePasswordProps {
  onViewChange: (view: "list" | "password" | "delete") => void;
}

export default function ChangePasswordView({ onViewChange }: ChangePasswordProps) {
  const { data: session } = useSession();
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) {
      setError("Please sign in to change your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to change password. Please check your current password.");
      }

      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-sans text-base font-medium text-[#1E1E1E]">Change Password</h2>
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium text-[#E3859A] transition hover:bg-[#FFF0F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
        >
          <ArrowLeft aria-hidden="true" size={16} /> Back
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div role="alert" className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="p-3 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm">
            {success}
          </div>
        )}

        {/* Current Password */}
        <div>
          <label htmlFor="current-password" className="mb-2 block font-sans text-sm text-[#444444]">
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={visible["current-password"] ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-[#F3A8B7] bg-white px-4 py-3 pr-12 font-sans text-sm text-[#444444] outline-none placeholder:text-gray-400 placeholder:text-base placeholder:tracking-widest focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25"
            />
            <button
              type="button"
              onClick={() => setVisible((current) => ({ ...current, "current-password": !current["current-password"] }))}
              aria-label={visible["current-password"] ? "Hide current password" : "Show current password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
            >
              {visible["current-password"] ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new-password" className="mb-2 block font-sans text-sm text-[#444444]">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={visible["new-password"] ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[#F3A8B7] bg-white px-4 py-3 pr-12 font-sans text-sm text-[#444444] outline-none placeholder:text-gray-400 placeholder:text-base placeholder:tracking-widest focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25"
            />
            <button
              type="button"
              onClick={() => setVisible((current) => ({ ...current, "new-password": !current["new-password"] }))}
              aria-label={visible["new-password"] ? "Hide new password" : "Show new password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
            >
              {visible["new-password"] ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="mb-2 block font-sans text-sm text-[#444444]">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={visible["confirm-password"] ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-[#F3A8B7] bg-white px-4 py-3 pr-12 font-sans text-sm text-[#444444] outline-none placeholder:text-gray-400 placeholder:text-base placeholder:tracking-widest focus:border-[#E88DA0] focus:ring-1 focus:ring-[#E88DA0]/25"
            />
            <button
              type="button"
              onClick={() => setVisible((current) => ({ ...current, "confirm-password": !current["confirm-password"] }))}
              aria-label={visible["confirm-password"] ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
            >
              {visible["confirm-password"] ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-10 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-[#d67288] disabled:opacity-50"
          >
            {loading ? (
              <>
                <span>Saving...</span>
                <Loader2 size={16} className="animate-spin" />
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
