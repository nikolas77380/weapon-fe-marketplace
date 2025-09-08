"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { Button } from "@/components/ui/button";
import { RegisterFormValues, RegisterSchema } from "@/schemas/registerSchema";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
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

  return (
    <div className="select-none mb-6 px-3.5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Display name */}
          <FormFieldComponent
            control={form.control}
            name="displayName"
            label="Display name"
            type="input"
            placeholder="Enter your display name"
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Email */}
          <FormFieldComponent
            control={form.control}
            name="email"
            label="Email"
            type="input"
            inputType="email"
            placeholder="Enter your email"
            autoComplete="email"
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Password */}
          <FormFieldComponent
            control={form.control}
            name="password"
            label="Password"
            type="input"
            inputType="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            className="rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Confirm Password */}
          <FormFieldComponent
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            type="input"
            inputType="password"
            placeholder="Confirm your password"
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
                  I{"’"}ve read and accept the
                </span>{" "}
                <span className="underline font-normal opacity-100">Terms</span>{" "}
                <span className="font-light opacity-60">&</span>{" "}
                <span className="underline font-normal opacity-100">
                  Privacy Policy
                </span>
              </p>
            }
            type="checkbox"
          />

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="font-medium rounded-none w-full py-3 bg-gold-main hover:bg-gold-main/90 text-white duration-300 transition-all"
            >
              Create Account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
