import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import ScrollReset from "@/components/ScrollReset";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollReset />
      <Nav />
      <main>{children}</main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
