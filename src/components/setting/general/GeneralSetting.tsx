"use client";

import { useState } from "react";
import SettingsList from "./SettingsList.tsx";
import ChangePasswordView from "./ChangePassword";
import DeleteAccountView from "./DeleteAccount";
import { useLanguage } from "@/components/providers/LanguageProvider";


export default function GeneralSettingsPage() {
  const [activeView, setActiveView] = useState<"list" | "password" | "delete">("list");
  const { t } = useLanguage();
  const copy = t.settings.general;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="mb-8">
        <h1 className="mb-2 font-crimson text-[24px] font-semibold text-[#1E1E1E]">{copy.title}</h1>
        <p className="font-sans text-base font-normal text-[#444444]">
          {copy.description}
        </p>
      </div>

      <div className="w-full">
        {activeView === "list" && <SettingsList onViewChange={setActiveView} />}
        {activeView === "password" && <ChangePasswordView onViewChange={setActiveView} />}
        {activeView === "delete" && <DeleteAccountView onViewChange={setActiveView} />}
      </div>
    </div>
  );
}
