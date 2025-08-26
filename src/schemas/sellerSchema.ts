import z from "zod";

export const sellerSchema = z.object({
  specialisation: z.string(),
  sellerDescription: z.string().min(1, "Required"),
  companyName: z.string(),
  webSite: z.string(),
  phoneNumbers: z.string(),
  country: z.string(),
  address: z.string(),
});

export type SellerFormValues = z.infer<typeof sellerSchema>;
