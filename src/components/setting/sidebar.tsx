"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Camera } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Edit Profile", href: "/setting" },
    { name: "General Settings", href: "/setting/general" },
    { name: "Language", href: "/setting/language" },
    { name: "Generated Books", href: "/setting/generated-books" },
    { name: "Ordered Book", href: "/setting/ordered-book" },
  ];

  return (
    <div className="flex w-full flex-col items-center rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex w-full flex-col items-center">
        {/* Profile Section */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100">
            <Image
              src="https://github.com/shadcn.png" // Ekhane apnar ashol image path diben
              alt="Profile Picture"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-gray-700">
            <Camera size={16} />
          </button>
        </div>

        <h2 className="text-center font-sans text-[24px] font-semibold text-[#1E1E1E]">Jack Khan</h2>
        <p className="mb-8 text-center font-sans text-[14px] font-normal text-[#444444]">jackkhan@gmail.com</p>

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
      <button className="mt-8 flex w-full items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm font-medium text-red-500 hover:bg-red-50">
        <span>Log out</span>
        <ChevronRight size={16} className="text-red-300" />
      </button>
    </div>
  );
}
