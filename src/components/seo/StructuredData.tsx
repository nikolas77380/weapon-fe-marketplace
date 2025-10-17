"use client";

import Script from "next/script";

interface StructuredDataProps {
  type: "Organization" | "WebSite" | "WebPage" | "Product" | "BreadcrumbList";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Esviem Defence",
          url: "https://esviem-defence.com",
          logo: "https://esviem-defence.com/logo.png",
          description:
            "Global marketplace for weapons, ammunition, and military equipment",
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
          },
          sameAs: [
            "https://twitter.com/esviemdefence",
            "https://linkedin.com/company/esviem-defence",
          ],
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Esviem Defence",
          url: "https://esviem-defence.com",
          description:
            "Global marketplace for weapons, ammunition, and military equipment",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://esviem-defence.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        };

      case "WebPage":
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: data.title,
          description: data.description,
          url: data.url,
          isPartOf: {
            "@type": "WebSite",
            name: "Esviem Defence",
            url: "https://esviem-defence.com",
          },
        };

      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: data.name,
          description: data.description,
          image: data.image,
          brand: {
            "@type": "Brand",
            name: "Esviem Defence",
          },
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: data.currency || "USD",
            availability: data.availability || "https://schema.org/InStock",
          },
        };

      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      default:
        return data;
    }
  };

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
