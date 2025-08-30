import z from "zod";

export const editProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  category: z.number().optional(),
  sku: z.string().optional(),
  status: z.enum(["available", "reserved", "sold", "archived"]).optional(),
  condition: z.string().optional(),
  quantity: z.number().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  images: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

export type EditProductSchemaValues = z.infer<typeof editProductSchema>;
