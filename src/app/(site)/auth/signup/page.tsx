import { SignupForm } from "./SignupForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShimmerLine } from "@/components/ui/ShimmerLine";

export const metadata = {
  title: "Create an account",
};

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Eyebrow withRule>Welcome</Eyebrow>
      <h1 className="swr-h1 text-center">
        <i>Make it yours.</i>
      </h1>
      <ShimmerLine />
      <p className="swr-lede text-center max-w-[360px]">
        Create an account to track orders, save addresses, and keep a wishlist
        between visits.
      </p>
      <SignupForm />
    </div>
  );
}
