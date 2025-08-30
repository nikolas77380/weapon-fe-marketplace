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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Display name */}
        <FormFieldComponent
          control={form.control}
          name="displayName"
          label="Display name"
          type="input"
          placeholder="Enter your display name"
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
        />

        {/* Terms */}
        <FormFieldComponent
          control={form.control}
          name="terms"
          label="Accept Terms and Conditions"
          type="checkbox"
        />

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className="px-8.5 py-2.5 text-xl font-roboto font-medium"
          >
            Create Account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
