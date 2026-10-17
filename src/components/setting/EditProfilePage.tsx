"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";

export default function EditProfilePage() {
  // isEditing state diye amra track korbo form ti edit mode a ache kina
  const [isEditing, setIsEditing] = useState(false);

  // Button click handle korar function
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Page reload thekabo
    if (isEditing) {
      // Ekhane apnar api call ba submit logic thakbe
      console.log("Form Submitted!");
      // Submit korar por abar disable kore dibo
      setIsEditing(false);
    } else {
      // Edit a click korle enable korbo
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
        <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Full Name Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Jack Khan"
              disabled={!isEditing}
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
              defaultValue="jackkhan@gmail.com"
              disabled={!isEditing}
              className={`w-full bg-[#FCF8F5] border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-opacity ${
                !isEditing ? "opacity-60 cursor-not-allowed" : "opacity-100"
              }`}
            />
          </div>
        </form>
      </div>

      {/* Action Button (Edit/Submit) */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleButtonClick}
          className={`flex items-center gap-2 text-white px-8 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm ${
            isEditing
              ? "bg-green-500 hover:bg-green-600" // Submit mode er color
              : "bg-[#E3859A] hover:bg-[#d67288]" // Edit mode er color
          }`}
        >
          <span>{isEditing ? "Submit" : "Edit"}</span>
          {isEditing ? <Check size={16} /> : <Pencil size={16} />}
        </button>
      </div>
    </div>
  );
}
