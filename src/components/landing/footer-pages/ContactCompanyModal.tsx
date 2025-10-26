"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactCompanyModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("FAQ.contactModal");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Здесь будет API вызов для отправки формы
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитация API вызова

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Автоматически закрываем модалку через 2 секунды после успешной отправки
      setTimeout(() => {
        onClose();
        setSubmitStatus("idle");
      }, 2000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus("idle");
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-card rounded-lg shadow-2xl border border-border"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-border">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 z-10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-3 pr-12">
                <div className="hidden sm:block p-2 bg-gold-main/10 rounded-lg">
                  <Mail className="w-5 h-5 text-gold-main" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {t("title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitStatus === "success" ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("form.successMessage")}
                  </h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      {t("form.nameLabel")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t("form.namePlaceholder")}
                      required
                      className="w-full px-4 py-3 bg-background border border-gold-main rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-main focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      {t("form.emailLabel")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("form.emailPlaceholder")}
                      required
                      className="w-full px-4 py-3 bg-background border border-gold-main rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-main focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      {t("form.messageLabel")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t("form.messagePlaceholder")}
                      rows={4}
                      className="w-full px-4 py-3 bg-background border border-gold-main rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-main focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gold-main text-background py-3 px-6 rounded-lg font-semibold hover:bg-gold-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        {t("form.submittingButton")}
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        {t("form.submitButton")}
                      </>
                    )}
                  </motion.button>

                  {/* Error Message */}
                  {submitStatus === "error" && (
                    <motion.div
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {t("form.errorMessage")}
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactCompanyModal;
