"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  const t = useTranslations("Auth.resetPassword");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const resetPasswordSchema = z
    .object({
      newPassword: z.string().min(6, t("passwordMinLength")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Backend integration - reset password
      console.log("Resetting password:", values.newPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(t("successMessage"));

      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push("/auth?mode=login");
      }, 1000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(t("errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full w-full relative pt-4 sm:pt-6 pb-8 sm:pb-12 lg:pb-16 z-1">
      <div className="absolute inset-0 z-[-1] bg-[#f2eeee]">
        <Image
          src="/auth/bg.png"
          alt="bg"
          fill
          className="object-cover mix-blend-exclusion w-full h-full"
        />
      </div>
      <div className="container mx-auto px-layout sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-0">
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-170">
            <div className="flex items-center justify-between lg:justify-center w-full mb-4 lg:mb-0">
              <div className="lg:hidden w-8"></div>
              <div className="flex justify-center">
                <Logo />
              </div>
              <div className="lg:hidden">
                <LanguageSwitcher
                  classNameSelectValue="text-gold-main"
                  classNameSelectTrigger="shadow-none border-gray-500"
                />
              </div>
            </div>
            <div className="border border-border-foreground rounded-sm mt-6 lg:mt-41 flex bg-background flex-col w-full lg:w-170 mx-auto">
              {/* Header */}
              <div className="flex flex-col items-center justify-center text-center border-b border-border-foreground px-4 sm:px-6 py-6">
                <div className="mb-4 p-3 bg-gold-main/10 rounded-full">
                  <ShieldCheck className="w-8 h-8 text-gold-main" />
                </div>
                <h2 className="font-medium text-xl sm:text-2xl bg-gradient-to-r from-foreground to-gray-secondary bg-clip-text text-transparent">
                  {t("title")}
                </h2>
                <p className="mt-2.5 font-light text-center text-sm sm:text-base text-muted-foreground max-w-md">
                  {t("description")}
                </p>
              </div>

              {/* Form */}
              <div className="select-none px-4 sm:px-6 py-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormFieldComponent
                      control={form.control}
                      name="newPassword"
                      label={t("labelNewPassword")}
                      type="input"
                      inputType="password"
                      placeholder={t("placeholderNewPassword")}
                      autoComplete="new-password"
                      className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      classNameLabel="bg-background"
                    />

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

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full font-medium py-3 rounded-sm text-white bg-gold-main hover:bg-gold-main/90 
                      duration-300 transition-all disabled:bg-gray-400 disabled:text-gray-100 
                      disabled:cursor-not-allowed disabled:hover:bg-gray-400 text-base xl:text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t("buttonResetting")}
                        </div>
                      ) : (
                        t("buttonReset")
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          {/* Language Switcher - Desktop */}
          <div className="hidden lg:flex lg:justify-start lg:max-w-[200px] w-full lg:mt-0">
            <LanguageSwitcher
              classNameSelectTrigger="shadow-none border-gray-500"
              classNameSelectValue="text-gold-main"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
