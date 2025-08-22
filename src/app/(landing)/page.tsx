import BestSelling from "@/components/landing/BestSelling";
import GetStarted from "@/components/landing/GetStarted";
import HowItWorks from "@/components/landing/HowItWorks";
import MainBanner from "@/components/landing/MainBanner";
import WhyChoose from "@/components/landing/WhyChoose";

export default function Home() {
  return (
    <main className="w-full h-full min-h-screen">
      <MainBanner />
      <WhyChoose />
      <BestSelling />
      <HowItWorks />
      <GetStarted />
    </main>
  );
}
