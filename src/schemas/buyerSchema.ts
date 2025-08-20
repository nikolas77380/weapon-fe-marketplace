import z from "zod";

export const buyerSchema = z
  .object({
    displayName: z.string().min(1, "Display name is required"),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BuyerFormValues = z.infer<typeof buyerSchema>;
