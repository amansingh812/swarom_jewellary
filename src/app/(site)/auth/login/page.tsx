import { LoginForm } from "./LoginForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShimmerLine } from "@/components/ui/ShimmerLine";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Eyebrow withRule>Welcome back</Eyebrow>
      <h1 className="swr-h1 text-center">
        <i>Sign in.</i>
      </h1>
      <ShimmerLine />
      <p className="swr-lede text-center max-w-[360px]">
        Your bag, your wishlist, and your order history — all in one quiet place.
      </p>
      <LoginForm />
    </div>
  );
}
