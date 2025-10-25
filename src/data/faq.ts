import { CreditCard, FileText, Shield, Users, Package } from "lucide-react";

export const faqData = [
  // Безопасность и верификация
  {
    questionKey: "questions.security.verifyBuyer",
    answerKey: "questions.security.verifyBuyerAnswer",
    categoryKey: "categories.security.title",
  },
  {
    questionKey: "questions.security.becomeSeller",
    answerKey: "questions.security.becomeSellerAnswer",
    categoryKey: "categories.security.title",
  },
  {
    questionKey: "questions.security.reportSuspicious",
    answerKey: "questions.security.reportSuspiciousAnswer",
    categoryKey: "categories.security.title",
  },
  {
    questionKey: "questions.security.dataProtection",
    answerKey: "questions.security.dataProtectionAnswer",
    categoryKey: "categories.security.title",
  },
  {
    questionKey: "questions.security.documentsRequired",
    answerKey: "questions.security.documentsRequiredAnswer",
    categoryKey: "categories.security.title",
  },

  // Управление аккаунтом
  {
    questionKey: "questions.account.changeProfile",
    answerKey: "questions.account.changeProfileAnswer",
    categoryKey: "categories.account.title",
  },
  {
    questionKey: "questions.account.deleteAccount",
    answerKey: "questions.account.deleteAccountAnswer",
    categoryKey: "categories.account.title",
  },
  {
    questionKey: "questions.account.changeRole",
    answerKey: "questions.account.changeRoleAnswer",
    categoryKey: "categories.account.title",
  },

  // Добавление товара
  {
    questionKey: "questions.products.addProduct",
    answerKey: "questions.products.addProductAnswer",
    categoryKey: "categories.products.title",
  },
  {
    questionKey: "questions.products.photoRequirements",
    answerKey: "questions.products.photoRequirementsAnswer",
    categoryKey: "categories.products.title",
  },
  {
    questionKey: "questions.products.editProduct",
    answerKey: "questions.products.editProductAnswer",
    categoryKey: "categories.products.title",
  },
  {
    questionKey: "questions.products.deleteProduct",
    answerKey: "questions.products.deleteProductAnswer",
    categoryKey: "categories.products.title",
  },

  // Правовые вопросы
  {
    questionKey: "questions.legal.prohibitedProducts",
    answerKey: "questions.legal.prohibitedProductsAnswer",
    categoryKey: "categories.legal.title",
  },
  {
    questionKey: "questions.legal.chatSystem",
    answerKey: "questions.legal.chatSystemAnswer",
    categoryKey: "categories.legal.title",
  },
  {
    questionKey: "questions.legal.platformFees",
    answerKey: "questions.legal.platformFeesAnswer",
    categoryKey: "categories.legal.title",
  },
  {
    questionKey: "questions.legal.resolveDisputes",
    answerKey: "questions.legal.resolveDisputesAnswer",
    categoryKey: "categories.legal.title",
  },
];

export const faqCategories = [
  {
    icon: Shield,
    titleKey: "categories.security.title",
    descriptionKey: "categories.security.description",
  },
  {
    icon: Users,
    titleKey: "categories.account.title",
    descriptionKey: "categories.account.description",
  },
  {
    icon: Package,
    titleKey: "categories.products.title",
    descriptionKey: "categories.products.description",
  },
  {
    icon: FileText,
    titleKey: "categories.legal.title",
    descriptionKey: "categories.legal.description",
  },
];
