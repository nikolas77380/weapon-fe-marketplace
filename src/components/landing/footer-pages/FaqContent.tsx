"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search, HelpCircle, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { faqCategories, faqData } from "@/data/faq";
import { faqContainerVariants, faqItemVariants } from "@/lib/faqAnimations";
import ContactCompanyModal from "./ContactCompanyModal";

const FaqContent = () => {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    t("categories.security.title")
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter((item) => {
    const categoryTitle = t(item.categoryKey);
    const matchesCategory = categoryTitle === selectedCategory;
    const questionText = t(item.questionKey);
    const answerText = t(item.answerKey);
    const matchesSearch =
      questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      answerText.toLowerCase().includes(searchQuery.toLowerCase());

    // Если есть поисковый запрос, показываем результаты по всем категориям
    if (searchQuery.trim()) {
      return matchesSearch;
    }

    // Иначе показываем только выбранную категорию
    return matchesCategory;
  });

  // Если поиск очищен и нет результатов, сбрасываем на первую категорию
  useEffect(() => {
    if (!searchQuery.trim() && filteredFaqs.length === 0) {
      setSelectedCategory(t("categories.security.title"));
    }
  }, [searchQuery, filteredFaqs.length, t]);

  // Функция для определения стиля категории
  const getCategoryStyle = (categoryTitle: string) => {
    // Проверяем, есть ли результаты поиска в этой категории
    if (searchQuery.trim()) {
      const hasSearchResults = faqData.some((item) => {
        const itemCategoryTitle = t(item.categoryKey);
        const questionText = t(item.questionKey);
        const answerText = t(item.answerKey);
        const matchesSearch =
          questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          answerText.toLowerCase().includes(searchQuery.toLowerCase());

        return itemCategoryTitle === categoryTitle && matchesSearch;
      });

      if (hasSearchResults) {
        return "border-gold-main/50 bg-gold-main/5";
      }

      // Если нет результатов поиска в этой категории, обычный стиль
      return "border-border hover:border-gold-main/50";
    }

    // Без поиска - показываем только выбранную категорию
    const isSelected = selectedCategory === categoryTitle;
    if (isSelected) {
      return "border-gold-main bg-gold-main/5";
    }

    return "border-border hover:border-gold-main/50";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 bg-gradient-to-br from-background to-gray-primary/30 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 bg-gold-main/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-24 h-24 bg-gray-secondary/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>

            {/* Search Bar */}
            <motion.div
              className="relative max-w-2xl mx-auto"
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-main focus:border-transparent transition-all duration-300"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        className="py-16 bg-card"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={faqContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {faqCategories.map((category, index) => {
              const categoryTitle = t(category.titleKey);
              return (
                <motion.div
                  key={index}
                  variants={faqItemVariants}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${getCategoryStyle(
                    categoryTitle
                  )}`}
                  onClick={() => setSelectedCategory(categoryTitle)}
                >
                  <category.icon className="w-8 h-8 mx-auto mb-4 text-gold-main" />
                  <h3 className="font-bold text-lg mb-2 text-center text-foreground">
                    {categoryTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {t(category.descriptionKey)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-16 bg-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ y: 15, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              {searchQuery.trim()
                ? `${t("sections.searchResults")}${
                    filteredFaqs.length > 0 ? ` (${filteredFaqs.length})` : ""
                  }`
                : `${t("sections.questionsByCategory")} "${selectedCategory}"`}
            </h2>

            <div className="space-y-4">
              {filteredFaqs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-foreground pr-4">
                      {t(item.questionKey)}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? "auto" : 0,
                      opacity: openIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                      {t(item.answerKey)}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("sections.noQuestionsFound")}
                </h3>
                <p className="text-muted-foreground">
                  {t("sections.tryDifferentSearch")}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="py-16 bg-gradient-to-br from-card to-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ y: 15, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("sections.needHelp")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("sections.supportDescription")}
            </p>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContactModalOpen(true)}
                className="bg-gold-main text-background px-8 py-4 rounded-lg font-semibold hover:bg-gold-main/90 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {t("sections.contactSupport")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Modal */}
      <ContactCompanyModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default FaqContent;
