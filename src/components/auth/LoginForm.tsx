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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
        <FormFieldComponent
          control={form.control}
          name="email"
          label="Email"
          type="input"
          inputType="email"
          placeholder="test@gmail.com"
          autoComplete="email"
        />

        <FormFieldComponent
          control={form.control}
          name="password"
          label="Password"
          type="input"
          inputType="password"
          placeholder="password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className="px-19 py-2.5 font-medium font-roboto text-xl"
          >
            Sign In
          </Button>
        </div>

        <div className="text-center">
          <Link href="#" className="text-blue-600 hover:underline">
            Forgot password
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
