import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#1F1D17] flex items-center justify-center">
      <SignIn />
    </div>
  );
}