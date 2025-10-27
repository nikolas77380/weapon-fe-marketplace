"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { Button } from "@/components/ui/button";
import { RegisterFormValues, RegisterSchema } from "@/schemas/registerSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import EmailConfirmationNotice from "./EmailConfirmationNotice";
import PrivacyPolicyModal from "../ui/PrivacyPolicyModal";
import Turnstile from "@/components/ui/turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { turnstileConfig } from "@/lib/turnstile";

interface RegisterFormProps {
  onSubmit: (
    values: RegisterFormValues & { turnstileToken?: string | null }
  ) => Promise<void>;
  showEmailConfirmation?: boolean;
  userEmail?: string;
}

const RegisterForm = ({
  onSubmit,
  showEmailConfirmation = false,
  userEmail,
}: RegisterFormProps) => {
  const t = useTranslations("Auth.register");

  const [isLoading, setIsLoading] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [showTurnstile, setShowTurnstile] = useState(false);

  // Turnstile configuration
  const turnstileFrontendConfig = turnstileConfig.getFrontendConfig();
  const turnstile = useTurnstile({
    siteKey: turnstileFrontendConfig?.siteKey || "",
    onError: (error) => {
      console.error("Turnstile error:", error);
    },
  });

  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleClosePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const handleRegister = async (values: RegisterFormValues) => {
    // Если Turnstile настроен, показываем его вместо отправки формы
    if (turnstileFrontendConfig && !showTurnstile) {
      setShowTurnstile(true);
      return;
    }

    // Проверяем валидацию Turnstile только если он показан
    if (turnstileFrontendConfig && showTurnstile && !turnstile.isVerified) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        ...values,
        turnstileToken: turnstileFrontendConfig ? turnstile.token : null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="select-none mb-6 px-3.5">
      {showEmailConfirmation && userEmail && (
        <div className="mb-6">
          <EmailConfirmationNotice email={userEmail} showSuccess={true} />
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="space-y-6"
        >
          {/* Display name */}
          <FormFieldComponent
            control={form.control}
            name="displayName"
            label={t("labelDisplayName")}
            type="input"
            placeholder={t("placeholderDisplayName")}
            className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            classNameLabel="bg-background"
          />

          {/* Email */}
          <FormFieldComponent
            control={form.control}
            name="email"
            label={t("labelEmail")}
            type="input"
            inputType="email"
            placeholder={t("placeholderEmail")}
            autoComplete="email"
            className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            classNameLabel="bg-background"
          />

          {/* Password */}
          <FormFieldComponent
            control={form.control}
            name="password"
            label={t("labelPassword")}
            type="input"
            inputType="password"
            placeholder={t("placeholderPassword")}
            autoComplete="new-password"
            className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            classNameLabel="bg-background"
          />

          {/* Confirm Password */}
          <FormFieldComponent
            control={form.control}
            name="confirmPassword"
            label={t("labelConfirmPassword")}
            type="input"
            inputType="password"
            placeholder={t("placeholderConfirmPassword")}
            autoComplete="new-password"
            className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            classNameLabel="bg-background"
          />

          {/* Terms */}
          <FormFieldComponent
            control={form.control}
            name="terms"
            label={
              <p className="text-sm">
                <span className="font-light opacity-60">
                  {t("termsPolicy1")}
                </span>{" "}
                <span
                  className="underline font-normal opacity-100 cursor-pointer hover:text-gold-main transition-colors duration-300"
                  onClick={handlePrivacyClick}
                >
                  {t("termsPolicy2")} {t("termsPolicy3")}
                </span>
              </p>
            }
            type="checkbox"
            className="border-gold-main focus:ring-gold-main focus:ring-offset-0 data-[state=checked]:bg-gold-main data-[state=checked]:border-gold-main data-[state=checked]:text-white"
          />

          {/* Turnstile Widget - показываем только после нажатия кнопки */}
          {turnstileFrontendConfig && showTurnstile && (
            <div className="flex justify-center my-4">
              <Turnstile
                siteKey={turnstileFrontendConfig.siteKey}
                onVerify={turnstile.onVerify}
                onError={turnstile.onError}
                onExpire={turnstile.onExpire}
                theme="auto"
                size="normal"
              />
            </div>
          )}

          {/* Turnstile Error Message */}
          {turnstile.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              Security verification failed. Please try again.
            </div>
          )}

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              disabled={
                isLoading ||
                (turnstileFrontendConfig && showTurnstile
                  ? !turnstile.isVerified
                  : false)
              }
              className="font-medium rounded-sm w-full py-3 bg-gold-main hover:bg-gold-main/90 
              text-white duration-300 transition-all disabled:bg-gray-400 disabled:text-gray-100 
              disabled:cursor-not-allowed disabled:hover:bg-gray-400 text-base xl:text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("creatingAccount")}
                </div>
              ) : turnstileFrontendConfig && !showTurnstile ? (
                t("createAccount")
              ) : (
                t("createAccount")
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={handleClosePrivacyModal}
      />
    </div>
  );
};

export default RegisterForm;
