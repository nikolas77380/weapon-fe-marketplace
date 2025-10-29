import z from "zod";

export const addProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productSku: z.string().min(1, "Product SKU is required"),
  productDescription: z.string().min(1, "Product description is required"),
  productCategory: z.string().min(1, "Product category is required"),
  productManufacturer: z.string().min(1, "Product manufacturer is required"),
  productModel: z.string().min(1, "Product model is required"),
  productCondition: z.string().min(1, "Product condition is required"),
  productPriceUSD: z.number().min(0.01, "Price must be greater than 0"),
  productPriceEUR: z.number().min(0.01, "Price must be greater than 0"),
  productPriceUAH: z.number().min(0.01, "Price must be greater than 0"),
  productCount: z.number().min(1, "Count must be greater than 0"),
  productStatus: z.enum(["available", "reserved", "sold", "archived"], {
    message: "Product status is required",
  }),
  productImages: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

export type AddProductSchemaValues = z.infer<typeof addProductSchema>;
