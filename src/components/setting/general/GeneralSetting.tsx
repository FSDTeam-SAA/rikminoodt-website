"use client";

import { useState } from "react";
import SettingsList from "./SettingsList.tsx";
import ChangePasswordView from "./ChangePassword";
import DeleteAccountView from "./DeleteAccount";


export default function GeneralSettingsPage() {
  const [activeView, setActiveView] = useState<"list" | "password" | "delete">("list");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 h-full min-h-[500px]">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-800 mb-2">General Settings</h1>
        <p className="text-sm text-gray-500">
          Change your password or permanently delete your account.
        </p>
      </div>

      <div className="max-w-3xl">
        {activeView === "list" && <SettingsList onViewChange={setActiveView} />}
        {activeView === "password" && <ChangePasswordView onViewChange={setActiveView} />}
        {activeView === "delete" && <DeleteAccountView onViewChange={setActiveView} />}
      </div>
    </div>
  );
}