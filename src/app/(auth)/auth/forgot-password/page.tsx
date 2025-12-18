"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/schemas/forgotPasswordSchema";
import { forgotPassword } from "@/lib/auth";

const ForgotPasswordPage = () => {
  const t = useTranslations("Auth.forgotPassword");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);

      toast.success(t("successMessage"));
      form.reset();

      // Redirect to login page after successful request
      setTimeout(() => {
        router.push("/auth?mode=login");
      }, 1500);
    } catch (error) {
      console.error("Error sending reset email:", error);
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message;
      toast.error(message || t("errorMessage"));
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
                  classNameSelectTrigger="shadow-none border-gray-500"
                  classNameSelectValue="text-gold-main"
                />
              </div>
            </div>
            <div className="border border-border-foreground rounded-sm mt-6 lg:mt-41 flex bg-background flex-col w-full lg:w-170 mx-auto">
              {/* Header */}
              <div className="flex flex-col items-center justify-center text-center border-b border-border-foreground px-4 sm:px-6 py-6">
                <div className="mb-4 p-3 bg-gold-main/10 rounded-full">
                  <Mail className="w-8 h-8 text-gold-main" />
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
                      name="email"
                      label={t("labelEmail")}
                      type="input"
                      inputType="email"
                      placeholder={t("placeholderEmail")}
                      autoComplete="email"
                      className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      classNameLabel="bg-background"
                    />

                    <div className="flex flex-col gap-3">
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
                            {t("buttonSending")}
                          </div>
                        ) : (
                          t("buttonSend")
                        )}
                      </Button>

                      <Link
                        href="/auth?mode=login"
                        className="w-full flex items-center justify-center gap-2 py-3 border border-border-foreground rounded-sm 
                        hover:bg-accent transition-colors text-sm sm:text-base font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {t("backToLogin")}
                      </Link>
                    </div>
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

export default ForgotPasswordPage;
