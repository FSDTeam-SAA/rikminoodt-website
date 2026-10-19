"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCurrentUser, useUpdateCurrentUser } from "@/lib/api/user-hooks";

export default function EditProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const { data: session, status, update } = useSession();
  const accessToken = session?.user?.accessToken;
  const { data: profileResponse, isLoading, error: profileError } = useCurrentUser(accessToken);
  const updateProfile = useUpdateCurrentUser(accessToken);
  const profile = profileResponse?.data;
  const email = profile?.email ?? session?.user?.email ?? "";

  useEffect(() => {
    if (profile?.name || session?.user?.name) {
      setName(profile?.name ?? session?.user?.name ?? "");
    }
  }, [profile?.name, session?.user?.name]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !accessToken) return;

    try {
      const response = await updateProfile.mutateAsync(trimmedName);
      await update({ user: { name: response.data.name } });
      setIsEditing(false);
    } catch {
      // The mutation's error state is rendered below.
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="rounded-2xl bg-white p-8 shadow-sm">Loading profile…</div>;
  }

  if (!accessToken || profileError) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm text-sm text-red-600">
        {profileError instanceof Error ? profileError.message : "Please sign in to view your profile."}
      </div>
    );
  }

  const errorMessage = updateProfile.error instanceof Error ? updateProfile.error.message : null;

  const handleButtonClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-crimson text-[24px] font-semibold text-[#1E1E1E]">Profile</h1>
          <p className="font-sans text-base font-normal text-[#444444]">
            Manage your personal details, orders and account settings all in one place.
          </p>
        </div>

        {/* Form Section */}
        <form id="profile-form" className="w-full space-y-6" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!isEditing}
              required
              className={`w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-opacity ${
                !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
              }`}
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              aria-readonly="true"
              className="w-full cursor-default rounded-xl border border-[#F3A8B7] bg-[#FCF8F5] px-4 py-3 text-sm text-gray-700 focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">Your email address cannot be changed.</p>
          </div>
          {errorMessage && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}
          {updateProfile.isSuccess && !isEditing && <p role="status" className="text-sm text-green-600">Your name has been updated.</p>}
        </form>
      </div>

      {/* Action Button (Edit/Submit) */}
      <div className="flex justify-end pt-6">
        <button
          type={isEditing ? "submit" : "button"}
          onClick={handleButtonClick}
          form={isEditing ? "profile-form" : undefined}
          disabled={updateProfile.isPending || (isEditing && !name.trim())}
          className={`flex items-center gap-2 text-white px-8 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm ${
            isEditing
              ? "bg-green-500 hover:bg-green-600" // Submit mode er color
              : "bg-[#E3859A] hover:bg-[#d67288]" // Edit mode er color
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <span>{isEditing ? (updateProfile.isPending ? "Saving…" : "Save") : "Edit"}</span>
          {isEditing ? <Check size={16} /> : <Pencil size={16} />}
        </button>
      </div>
    </div>
  );
}
