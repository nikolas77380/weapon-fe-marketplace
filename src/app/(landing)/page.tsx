import BestSelling from "@/components/landing/BestSelling";
import Footer from "@/components/landing/Footer";
import GetStarted from "@/components/landing/GetStarted";
import HowItWorks from "@/components/landing/HowItWorks";
import MainBanner from "@/components/landing/MainBanner";
import WhyChoose from "@/components/landing/WhyChoose";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <main className="w-full h-full min-h-screen">
      <Navbar />
      <MainBanner />
      <WhyChoose />
      <BestSelling />
      <HowItWorks />
      <GetStarted />
      <Footer />
    </main>
  );
}
