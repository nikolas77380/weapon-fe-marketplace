import z from "zod";

export const createAddProductSchema = (t: (key: string) => string) => {
  return z.object({
    productName: z.string().min(1, t("validation.productNameRequired")),
    productSku: z.string().optional(),
    productDescription: z
      .string()
      .min(1, t("validation.productDescriptionRequired")),
    productCategory: z.string().min(1, t("validation.productCategoryRequired")),
    productManufacturer: z
      .string()
      .min(1, t("validation.productManufacturerRequired")),
    productModel: z.string().min(1, t("validation.productModelRequired")),
    productCondition: z.enum(["new", "used"], {
      message: t("validation.productConditionRequired"),
    }),
    productPrice: z.number().min(0.01, t("validation.priceGreaterThanZero")),
    productCurrency: z.enum(["USD", "EUR", "UAH"], {
      message: t("validation.currencyRequired"),
    }),
    productCount: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === "" || val === 0) {
          return undefined;
        }
        return val;
      },
      z.union([
        z.undefined(),
        z.number().min(1, t("validation.countGreaterThanZero")),
      ]).optional()
    ),
    productStatus: z.enum(["available", "unavailable"], {
      message: t("validation.productStatusRequired"),
    }),
    productVideoUrl: z
      .union([z.string().url(), z.literal(""), z.undefined()])
      .optional(),
    productImages: z
      .array(z.instanceof(File))
      .min(1, t("validation.minImages"))
      .max(5, t("validation.maxImages")),
  });
};

// Default schema for backward compatibility
export const addProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productSku: z.string().optional(),
  productDescription: z.string().min(1, "Product description is required"),
  productCategory: z.string().min(1, "Product category is required"),
  productManufacturer: z.string().min(1, "Product manufacturer is required"),
  productModel: z.string().min(1, "Product model is required"),
  productCondition: z.enum(["new", "used"], {
    message: "Product condition is required",
  }),
  productPrice: z.number().min(0.01, "Price must be greater than 0"),
  productCurrency: z.enum(["USD", "EUR", "UAH"], {
    message: "Currency is required",
  }),
  productCount: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "" || val === 0) {
        return undefined;
      }
      return val;
    },
    z.union([
      z.undefined(),
      z.number().min(1, "Count must be greater than 0"),
    ]).optional()
  ),
  productStatus: z.enum(["available", "unavailable"], {
    message: "Product status is required",
  }),
  productVideoUrl: z.string().url().optional().or(z.literal("")),
  productImages: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
});

export type AddProductSchemaValues = z.infer<typeof addProductSchema>;
