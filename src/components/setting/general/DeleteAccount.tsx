"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/config/api";

interface DeleteAccountProps {
  onViewChange: (view: "list" | "password" | "delete") => void;
}

export default function DeleteAccountView({ onViewChange }: DeleteAccountProps) {
  const { data: session } = useSession();
  const [selectedReason, setSelectedReason] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteReasons = [
    "I don't use the app anymore",
    "I'm concerned about my privacy",
    "I'm taking a break",
    "I'm creating a different account",
    "The app doesn't meet my needs",
    "I experienced technical issues",
    "Other reason",
  ];

  const handleDelete = async () => {
    setError("");
    const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) {
      setError("Please sign in to delete your account.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/user/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete account. Please try again.");
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
      }
      await signOut({ callbackUrl: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <h2 className="text-sm text-gray-700 font-medium mb-4">Delete Account</h2>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Are you sure to delete your account?</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Deleting your account will permanently remove your profile, settings, and all associated data from our platform. Once the deletion process is completed, your account cannot be restored and you will lose access to all features and services linked to it.
        </p>

        <h3 className="text-sm font-semibold text-gray-800 mb-4">Reason for leaving</h3>

        {error && (
          <div role="alert" className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-10">
          {deleteReasons.map((reason, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="deleteReason"
                checked={selectedReason === index}
                onChange={() => setSelectedReason(index)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-800">{reason}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end items-center gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => onViewChange("list")}
            className="px-8 py-2.5 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 transition-colors font-medium text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#C73A3A] hover:bg-red-700 text-white transition-colors font-medium text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <span>Deleting...</span>
                <Loader2 size={16} className="animate-spin" />
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
