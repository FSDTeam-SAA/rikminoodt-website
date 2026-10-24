"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Camera, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";
import LogoutConfirmationModal from "@/components/shared/LogoutConfirmationModal";

export default function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState<string>(session?.user?.name || "Jack Khan");
  const [userEmail, setUserEmail] = useState<string>(session?.user?.email || "jackkhan@gmail.com");
  const [userAvatar, setUserAvatar] = useState<string>(session?.user?.profileImage || "https://github.com/shadcn.png");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (!res.ok) return;
        const result = await res.json();
        if (result?.data) {
          if (result.data.name) setUserName(result.data.name);
          if (result.data.email) setUserEmail(result.data.email);
          if (result.data.profileImage) setUserAvatar(result.data.profileImage);
        }
      } catch (err) {
        console.error("Failed to load user profile in sidebar:", err);
      }
    };

    void fetchUserProfile();
  }, [session?.user?.accessToken]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(`${getApiBaseUrl()}/user/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        const newImageUrl = result?.data?.profileImage || URL.createObjectURL(file);
        setUserAvatar(newImageUrl);
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
    }
    await signOut({ callbackUrl: "/login" });
  };

  const settingsLabels = t.settings;

  const menuItems = [
    { name: settingsLabels.editProfile, href: "/setting" },
    { name: settingsLabels.general.title, href: "/setting/general" },
    { name: settingsLabels.language, href: "/setting/language" },
    { name: settingsLabels.generatedBooks, href: "/setting/generated-books" },
    { name: settingsLabels.orderedBooks, href: "/setting/ordered-book" },
  ];

  return (
    <div className="flex w-full flex-col items-center rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex w-full flex-col items-center">
        {/* Profile Section */}
        <div className="relative mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100">
            <Image
              src={userAvatar}
              alt="Profile Picture"
              width={96}
              height={96}
              unoptimized
              className="object-cover w-full h-full"
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 size={22} className="animate-spin text-white" />
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Upload profile image"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-gray-700 transition"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <h2 className="text-center font-sans text-[24px] font-semibold text-[#1E1E1E]">{userName}</h2>
        <p className="mb-8 text-center font-sans text-[14px] font-normal text-[#444444]">{userEmail}</p>

        {/* Navigation Menu */}
        <div className="w-full flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-rose-50 text-gray-800"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span>{item.name}</span>
                <ChevronRight size={16} className={isActive ? "text-gray-400" : "text-gray-300"} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={() => setLogoutModalOpen(true)}
        className="mt-8 flex w-full items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm font-medium text-red-500 hover:bg-red-50"
      >
        <span>{settingsLabels.logout}</span>
        <ChevronRight size={16} className="text-red-300" />
      </button>
      <LogoutConfirmationModal
        open={logoutModalOpen}
        isLoggingOut={isLoggingOut}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
