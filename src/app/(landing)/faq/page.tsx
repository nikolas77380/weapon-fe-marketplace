import React from "react";
import FaqContent from "@/components/landing/footer-pages/FaqContent";

const FaqPage = () => {
  return (
    <main className="w-full h-full min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-primary py-25">
        <div className="flex flex-col text-center gap-7">
          <h1 className="flex flex-col items-center font-bold text-4xl font-roboto">
            <span>Frequently Asked</span>
            <span>Questions</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find answers to common questions about our weapon marketplace
            platform, verification processes, and security protocols.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-7">
        <div className="container mx-auto max-w-4xl">
          <FaqContent />
        </div>
      </section>
    </main>
  );
};

export default FaqPage;
