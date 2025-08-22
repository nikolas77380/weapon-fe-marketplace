import React from "react";
import FaqAccordion from "./FaqAccordion";
import { faqCategories, faqData } from "@/data/faq";

const FaqContent = () => {
  return (
    <div className="space-y-16">
      {/* FAQ Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {faqCategories.map((category, index) => (
          <div
            key={index}
            className="bg-gray-primary p-6 rounded-lg text-center hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <category.icon className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">{category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div>
        <h2 className="font-bold text-3xl font-roboto mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <FaqAccordion items={faqData} />
      </div>

      {/* Additional Help Section */}
      <div className="bg-gray-primary p-8 rounded-2xl">
        <h3 className="font-bold text-2xl mb-4 text-center">
          Still need help?
        </h3>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Can&apos;t find the answer you&apos;re looking for? Our support team
          is here to help you with any questions about our weapon marketplace
          platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-black/80 transition-colors">
            Contact Support
          </button>
          <button className="border border-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqContent;
