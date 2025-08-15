import z from "zod";

export const sellerSchema = z.object({
  email: z.string(),
  fullName: z.string().min(1, "Required"),
  password: z.string().min(8, "Min 8 characters"),
  confirmPassword: z.string().min(8, "Min 8 characters"),
  businessName: z.string().min(1, "Required"),
  businessType: z.string().optional().or(z.literal("")),
  businessDescription: z.string().min(3, "Required"),
  businessPhone: z.string().min(8, "Invalid phone"),
  website: z.string().optional().or(z.literal("")),
  businessAddress: z.string().min(3, "Required"),
  terms: z.boolean().refine(val => val, "You must accept terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SellerFormValues = z.infer<typeof sellerSchema>;