import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#1F1D17] flex items-center justify-center">
      <SignUp fallbackRedirectUrl="/onboarding" />
    </div>
  );
}