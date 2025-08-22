import { CreditCard, FileText, Shield, Users } from "lucide-react";

export const faqData = [
  {
    question: "How do I verify my account as a buyer?",
    answer:
      "To verify your buyer account, you'll need to provide valid government-issued identification, proof of employment in law enforcement, military, or security sectors, and complete our background verification process. This typically takes 2-3 business days.",
  },
  {
    question: "What documents are required for seller verification?",
    answer:
      "Sellers must provide business licenses, federal firearms licenses (if applicable), tax identification numbers, and proof of compliance with all relevant regulations. We also conduct thorough background checks on all seller applications.",
  },
  {
    question: "How secure are transactions on the platform?",
    answer:
      "All transactions are protected by military-grade encryption. We use escrow services to ensure both parties are protected, and all payments are processed through secure, compliant payment gateways that meet industry standards.",
  },
  {
    question: "What types of weapons are allowed on the platform?",
    answer:
      "We allow all legally permitted weapons and equipment that comply with federal, state, and local regulations. This includes firearms, tactical gear, surveillance equipment, and other security-related products. All listings are reviewed for compliance.",
  },
  {
    question: "How do I report suspicious activity?",
    answer:
      "You can report suspicious activity through our dedicated security hotline, email security@weaponmarketplace.com, or use the report button on any listing. All reports are investigated within 24 hours by our security team.",
  },
  {
    question: "What are the platform fees?",
    answer:
      "We charge a 3% transaction fee on all successful sales. There are no monthly fees or listing fees. Premium sellers with verified status may qualify for reduced fees of 2%.",
  },
  {
    question: "How do I resolve disputes with other users?",
    answer:
      "Our dispute resolution team handles all conflicts between buyers and sellers. You can initiate a dispute through your account dashboard, and our team will investigate and mediate the situation according to our platform policies.",
  },
  {
    question: "Is my personal information protected?",
    answer:
      "Yes, we follow strict data protection protocols and never share your personal information with third parties without your explicit consent. All data is encrypted and stored securely in compliance with industry standards.",
  },
];

export const faqCategories = [
  {
    icon: Shield,
    title: "Security & Verification",
    description:
      "Learn about our security protocols and verification processes",
  },
  {
    icon: Users,
    title: "Account Management",
    description: "How to manage your account and profile settings",
  },
  {
    icon: CreditCard,
    title: "Payments & Transactions",
    description: "Information about payment methods and transaction security",
  },
  {
    icon: FileText,
    title: "Legal & Compliance",
    description: "Understanding legal requirements and platform policies",
  },
];
