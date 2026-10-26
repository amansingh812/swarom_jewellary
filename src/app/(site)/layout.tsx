import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BagDrawer } from "@/components/site/BagDrawer";
import { Providers } from "@/components/site/Providers";
import { OrnamentDefs } from "@/components/ui/Ornament";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <OrnamentDefs />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <BagDrawer />
    </Providers>
  );
}
