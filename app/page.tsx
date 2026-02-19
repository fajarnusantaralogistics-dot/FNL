import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import CompanyOverview from "@/components/company-overview";
import WhyChooseUs from "@/components/why-choose-us";
import Services from "@/components/services";
import Gallery from "@/components/gallery";
import Clients from "@/components/clients";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { buildMetadata } from "@/components/seo";

export const metadata = buildMetadata({
  title: "Fajar Nusantara Logistik - Solusi Pengiriman Terpercaya",
  description:
    "Layanan logistik dan ekspedisi terpercaya untuk pengiriman barang, kendaraan, dan alat berat ke seluruh Indonesia.",
  pathname: "/",
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <CompanyOverview />
      <WhyChooseUs />
      <Services />
      <Gallery />
      <Clients />
      <Testimonials />
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
    </div>
  );
}
