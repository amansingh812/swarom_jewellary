import { AmbientOrbs } from "@/components/site/AmbientOrbs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden min-h-[80vh]">
      <AmbientOrbs />
      <div className="relative z-[1] mx-auto max-w-[440px] px-5 py-12 md:py-20">
        {children}
      </div>
    </div>
  );
}
