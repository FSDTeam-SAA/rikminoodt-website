import { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center font-sans text-xs text-[#6B7280]">
          Loading reset password...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

