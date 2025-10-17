// import { Metadata } from "next";

export function generateMetaTitle(
  title: string,
  siteName: string = "Esviem Defence"
): string {
  return `${title} | ${siteName}`;
}

export function generateMetaDescription(
  description: string,
  maxLength: number = 160
): string {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 3) + "...";
}

export function generateKeywords(
  baseKeywords: string[],
  additionalKeywords: string[] = []
): string[] {
  return [...new Set([...baseKeywords, ...additionalKeywords])];
}

export function generateCanonicalUrl(
  path: string,
  baseUrl: string = "https://esviem-defence.com"
): string {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function generateOpenGraphImage(): string {
  // This would typically generate an image using a service like Vercel OG Image Generator
  // For now, return a placeholder
  return `/landing/hero-banner.png`;
}

export const baseKeywords = [
  "weapons marketplace",
  "ammunition marketplace",
  "military equipment",
  "arms trading",
  "weapon sales",
  "military gear",
  "defense equipment",
  "tactical gear",
  "firearms marketplace",
  "military surplus",
];

export const categoryKeywords = {
  weapons: ["firearms", "rifles", "pistols", "shotguns", "weapon parts"],
  ammunition: ["bullets", "cartridges", "ammo", "rounds", "shells"],
  equipment: ["tactical gear", "military clothing", "body armor", "helmets"],
  accessories: [
    "scopes",
    "sights",
    "tactical accessories",
    "weapon accessories",
  ],
};

export function getCategoryKeywords(category: string): string[] {
  return categoryKeywords[category as keyof typeof categoryKeywords] || [];
}
