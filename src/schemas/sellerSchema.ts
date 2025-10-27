import z from "zod";

export const sellerSchema = z.object({
  specialisation: z.string().min(1, "Required"),
  sellerDescription: z.string().min(1, "Required"),
  companyName: z.string().min(1, "Required"),
  webSite: z.string().optional(),
  phoneNumbers: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  workTimeMonFri: z.string().optional(),
  workTimeSaturday: z.string().optional(),
  workTimeSunday: z.string().optional(),
});

export type SellerFormValues = z.infer<typeof sellerSchema>;
