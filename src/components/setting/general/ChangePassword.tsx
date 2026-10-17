import { EyeOff } from "lucide-react";

interface ChangePasswordProps {
  onViewChange: (view: "list" | "password" | "delete") => void;
}

export default function ChangePasswordView({ onViewChange }: ChangePasswordProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-sm text-gray-700 font-medium mb-4">Change Password</h2>
      
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onViewChange("list"); }}>
        <div>
          <label className="block text-xs text-gray-600 mb-2">Current Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="****************"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeOff size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-2">New Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="****************"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeOff size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="****************"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeOff size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-[#E3859A] hover:bg-[#d67288] text-white px-10 py-2.5 rounded-xl transition-colors font-medium text-sm">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}