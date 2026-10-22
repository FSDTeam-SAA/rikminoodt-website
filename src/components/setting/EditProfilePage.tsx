"use client";

import { useEffect, useState } from "react";
import { Pencil, Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { getApiBaseUrl } from "@/config/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load user profile");
        const json = await res.json();
        if (json?.data) {
          setName(json.data.name || "");
          setEmail(json.data.email || "");
          setPhone(json.data.phone || "");
          setCountry(json.data.country || "");
          setGender(json.data.gender || "male");
          if (json.data.dob) {
            try {
              const formattedDob = new Date(json.data.dob).toISOString().split("T")[0];
              setDob(formattedDob);
            } catch {
              setDob("");
            }
          } else {
            setDob("");
          }
          setBio(json.data.bio || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [session?.user?.accessToken]);

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage(null);

    if (isEditing) {
      const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      if (!token) {
        setMessage({ text: "Authentication token missing. Please sign in again.", type: "error" });
        return;
      }

      setSaving(true);
      try {
        const body: Record<string, string> = {
          name: name.trim(),
          phone: phone.trim(),
          country: country.trim(),
          gender,
          bio: bio.trim(),
        };

        if (dob) {
          try {
            body.dob = new Date(dob).toISOString();
          } catch {
            // ignore date parsing error
          }
        }

        const res = await fetch(`${getApiBaseUrl()}/user/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const json = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(json?.message || "Failed to update profile");
        }

        setMessage({ text: "Profile updated successfully!", type: "success" });
        setIsEditing(false);
      } catch (err) {
        setMessage({ text: err instanceof Error ? err.message : "Failed to update profile", type: "error" });
      } finally {
        setSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-crimson text-[24px] font-semibold text-[#1E1E1E]">Profile</h1>
          <p className="font-sans text-base font-normal text-[#444444]">
            Manage your personal details, orders and account settings all in one place.
          </p>
        </div>

        {loading ? (
          <div role="status" aria-label="Loading profile" className="animate-pulse space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index}>
                  <div className="mb-2 h-4 w-24 rounded-full bg-[#F3E7EB]" />
                  <div className="h-[46px] w-full rounded-xl bg-[#F8F0F2]" />
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2 h-4 w-14 rounded-full bg-[#F3E7EB]" />
              <div className="h-24 w-full rounded-xl bg-[#F8F0F2]" />
            </div>
          </div>
        ) : (
          <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
            {message && (
              <div
                className={`p-3 rounded-xl text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing || saving}
                  placeholder="Enter your full name"
                  className={`w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-opacity ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
                  }`}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 opacity-60 cursor-not-allowed"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing || saving}
                  placeholder="+1 234 567 890"
                  className={`w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-opacity ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
                  }`}
                />
              </div>

              {/* Country Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={!isEditing || saving}
                  placeholder="e.g. Bangladesh, United Kingdom"
                  className={`w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-opacity ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
                  }`}
                />
              </div>

              {/* Gender Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Gender
                </label>
                <Select
                  value={gender}
                  disabled={!isEditing || saving}
                  onValueChange={(val) => {
                    if (val) setGender(val);
                  }}
                >
                  <SelectTrigger
                    className={`h-[46px] w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus-visible:border-[#E88DA0] focus-visible:ring-1 focus-visible:ring-rose-200 transition-opacity ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
                    }`}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="z-[110] border border-[#F3A8B7] bg-white text-[#4B4650] shadow-md rounded-xl">
                    <SelectItem value="male" className="cursor-pointer py-2 hover:bg-[#FFF3F5]">
                      Male
                    </SelectItem>
                    <SelectItem value="female" className="cursor-pointer py-2 hover:bg-[#FFF3F5]">
                      Female
                    </SelectItem>
                    <SelectItem value="other" className="cursor-pointer py-2 hover:bg-[#FFF3F5]">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={!isEditing || saving}
                  className={`w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-opacity ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
                  }`}
                />
              </div>
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-medium">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing || saving}
                rows={3}
                placeholder="Write a short bio about yourself..."
                className={`w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-200 resize-none transition-opacity ${
                  !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
                }`}
              />
            </div>
          </form>
        )}
      </div>

      {/* Action Button (Edit/Submit) */}
      {!loading && (
        <div className="flex justify-end pt-6">
          <button
            type="button"
            disabled={saving}
            onClick={handleButtonClick}
            className={`flex items-center gap-2 text-white px-8 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm disabled:opacity-50 ${
              isEditing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-[#E3859A] hover:bg-[#d67288]"
            }`}
          >
            {saving ? (
              <>
                <span>Saving...</span>
                <Loader2 size={16} className="animate-spin" />
              </>
            ) : (
              <>
                <span>{isEditing ? "Submit" : "Edit"}</span>
                {isEditing ? <Check size={16} /> : <Pencil size={16} />}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
