import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useDeleteCurrentUser } from "@/lib/api/user-hooks";

interface DeleteAccountProps {
  onViewChange: (view: "list" | "password" | "delete") => void;
}

export default function DeleteAccountView({ onViewChange }: DeleteAccountProps) {
  const [reason, setReason] = useState("I don't use the app anymore");
  const { data: session } = useSession();
  const deleteMutation = useDeleteCurrentUser(session?.user?.accessToken);
  const deleteReasons = [
    "I don't use the app anymore",
    "I'm concerned about my privacy",
    "I'm taking a break",
    "I'm creating a different account",
    "The app doesn't meet my needs",
    "I experienced technical issues",
    "Other reason"
  ];

  const handleDelete = async () => {
    if (!session?.user?.accessToken) return;

    try {
      await deleteMutation.mutateAsync();
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
      }
      await signOut({ callbackUrl: "/" });
    } catch {
      // The mutation's error state is rendered below.
    }
  };

  const errorMessage = deleteMutation.error instanceof Error ? deleteMutation.error.message : null;

  return (
    <div className="space-y-6 pb-6">
      <h2 className="text-sm text-gray-700 font-medium mb-4">Delete Account</h2>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Are you sure to delete your account?</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Deleting your account will permanently remove your profile, settings, and all associated data from our platform. Once the deletion process is completed, your account cannot be restored and you will lose access to all features and services linked to it.
        </p>

        <h3 className="text-sm font-semibold text-gray-800 mb-4">Why are you deleting your account?</h3>
        
        <div className="space-y-3 mb-10">
          {deleteReasons.map((deleteReason) => (
            <label key={deleteReason} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="deleteReason" 
                value={deleteReason}
                checked={reason === deleteReason}
                onChange={(event) => setReason(event.target.value)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-800">{deleteReason}</span>
            </label>
          ))}
        </div>

        {errorMessage && <p role="alert" className="mb-4 text-sm text-red-600">{errorMessage}</p>}
        <div className="flex justify-end items-center gap-4">
          <button 
            type="button"
            onClick={() => onViewChange("list")}
            className="px-8 py-2.5 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="px-8 py-2.5 rounded-xl bg-[#C73A3A] hover:bg-red-700 text-white transition-colors font-medium text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
