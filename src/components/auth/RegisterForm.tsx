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

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const t = useTranslations("Auth.register");

  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="select-none mb-6 px-3.5">
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
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                <span className="underline font-normal opacity-100">
                  {t("termsPolicy2")}
                </span>{" "}
                <span className="font-light opacity-60">&</span>{" "}
                <span className="underline font-normal opacity-100">
                  {t("termsPolicy3")}
                </span>
              </p>
            }
            type="checkbox"
          />

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="font-medium rounded-none w-full py-3 bg-gold-main hover:bg-gold-main/90 
              text-white duration-300 transition-all disabled:bg-gray-500 disabled:text-gray-100 
              disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("creatingAccount")}
                </div>
              ) : (
                <>
                  {t("createAccount")}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
