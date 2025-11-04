import z from "zod";

export const editProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  // New format: price + currency
  price: z.number().optional(),
  currency: z.enum(["USD", "EUR", "UAH"]).optional(),
  // Legacy fields for backward compatibility
  priceUSD: z.number().optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  status: z.enum(["available", "unavailable"]).optional(),
  condition: z.enum(["new", "used"]).optional(),
  quantity: z.number().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  videoUrl: z
    .union([z.string().url(), z.literal(""), z.undefined()])
    .optional(),
  images: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

export type EditProductSchemaValues = z.infer<typeof editProductSchema>;
