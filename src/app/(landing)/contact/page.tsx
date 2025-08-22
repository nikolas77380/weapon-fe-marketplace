import React from "react";
import ContactUsForm from "@/components/landing/footer-pages/ContactUsForm";
import ContactUsInformation from "@/components/landing/footer-pages/ContactUsInformation";

const ContactPage = () => {
  return (
    <main className="w-full h-full min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-primary py-25">
        <div className="flex flex-col text-center gap-7">
          <h1 className="flex flex-col items-center font-bold text-4xl font-roboto">
            <span>Get in touch</span>
            <span>with our team</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions about our weapon marketplace? We&apos;re here to help
            you connect with trusted suppliers and buyers.
          </p>
        </div>
      </section>
      {/* Contact Content */}
      <section className="py-16 px-7">
        <div className="container mx-auto">
          <div className="flex justify-between border-b border-[#D3D3D3] pb-18">
            {/* Contact Form */}
            <ContactUsForm />
            {/* Contact Information */}
            <ContactUsInformation />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
