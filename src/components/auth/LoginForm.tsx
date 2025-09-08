"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { Button } from "@/components/ui/button";
import { LoginFormValues, loginSchema } from "@/schemas/loginSchema";
import Link from "next/link";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="select-none mb-6 px-3.5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <FormFieldComponent
            control={form.control}
            name="email"
            label="Email"
            type="input"
            inputType="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <FormFieldComponent
            control={form.control}
            name="password"
            label="Password"
            type="input"
            inputType="password"
            placeholder="********"
            autoComplete="current-password"
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <div className="w-full flex justify-end">
            <Link href="#" className="underline font-light text-sm">
              Forgot password
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="w-full font-medium py-3 rounded-none text-white bg-gold-main hover:bg-gold-main/90 duration-300 transition-all"
            >
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
