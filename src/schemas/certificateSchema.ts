import { z } from "zod";

export const certificateSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().optional(),
    issuedBy: z
      .string()
      .min(1, "Issued by is required")
      .max(255, "Issued by is too long"),
    issuedDate: z.string().min(1, "Issued date is required"),
    expiryDate: z.string().optional(),
    certificateNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validate that issued date is not in the future
      const issuedDate = new Date(data.issuedDate);
      const today = new Date();
      return issuedDate <= today;
    },
    {
      message: "Issued date cannot be in the future",
      path: ["issuedDate"],
    }
  )
  .refine(
    (data) => {
      // Validate that expiry date is after issued date if provided
      if (data.expiryDate) {
        const issuedDate = new Date(data.issuedDate);
        const expiryDate = new Date(data.expiryDate);
        return expiryDate > issuedDate;
      }
      return true;
    },
    {
      message: "Expiry date must be after issued date",
      path: ["expiryDate"],
    }
  );

export type CertificateFormValues = z.infer<typeof certificateSchema>;
