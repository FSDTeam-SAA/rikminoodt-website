import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boekerello - Authentication",
  description: "Sign in, reset password, and manage your Boekerello account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white text-[#1E1E1E] antialiased">
      {children}
    </div>
  );
}

