"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { Button } from "@/components/ui/button";
import { LoginFormValues, loginSchema } from "@/schemas/loginSchema";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const t = useTranslations("Auth.login");

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
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
          onSubmit={form.handleSubmit(handleLogin)}
          className="space-y-6 mt-8"
        >
          <FormFieldComponent
            control={form.control}
            name="email"
            label={t("labelEmail")}
            type="input"
            inputType="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            classNameLabel="bg-background"
          />

          <FormFieldComponent
            control={form.control}
            name="password"
            label={t("labelPassword")}
            type="input"
            inputType="password"
            placeholder="********"
            autoComplete="current-password"
            className="rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            classNameLabel="bg-background"
          />

          <div className="w-full flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="underline font-light text-sm"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="flex items-center justify-center">
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
                  {t("signingIn")}
                </div>
              ) : (
                <>{t("signgIn")}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
