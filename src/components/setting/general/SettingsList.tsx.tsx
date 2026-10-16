import { ChevronRight } from "lucide-react";

interface SettingsListProps {
  onViewChange: (view: "list" | "password" | "delete") => void;
}

export default function SettingsList({ onViewChange }: SettingsListProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => onViewChange("password")}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm text-gray-700 font-medium"
      >
        <span>Change Password</span>
        <ChevronRight size={18} className="text-gray-400" />
      </button>

      <button
        onClick={() => onViewChange("delete")}
        className="w-full flex items-center justify-between px-5 py-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-sm text-red-500 font-medium"
      >
        <span>Delete Account</span>
        <ChevronRight size={18} className="text-red-400" />
      </button>
    </div>
  );
}