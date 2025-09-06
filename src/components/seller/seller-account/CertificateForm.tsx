"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import ImagesDropzone from "@/components/ui/ImagesDropzone";
import {
  certificateSchema,
  CertificateFormValues,
} from "@/schemas/certificateSchema";
import { useCertificateActions } from "@/hooks/useCertificates";
import { UserProfile } from "@/lib/types";

interface CertificateFormProps {
  currentUser: UserProfile;
  onSuccess?: () => void;
}

const CertificateForm = ({ currentUser, onSuccess }: CertificateFormProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { createCertificate } = useCertificateActions();

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
      description: "",
      issuedBy: "",
      issuedDate: "",
      expiryDate: "",
      certificateNumber: "",
    },
  });

  const handleSubmit = async (values: CertificateFormValues) => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one certificate file");
      return;
    }

    // Validate that we have exactly one file (as per schema)
    if (selectedFiles.length > 1) {
      toast.error("Please select only one certificate file");
      return;
    }

    setIsLoading(true);
    try {
      const certificateData = {
        ...values,
        certificateType: "seller" as const,
        status: "active" as const,
      };

      await createCertificate(certificateData, selectedFiles);

      toast.success("Certificate uploaded successfully!");

      // Reset form
      form.reset();
      setSelectedFiles([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error uploading certificate:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });

      // More detailed error handling
      let errorMessage = "Unknown error";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(`Failed to upload certificate: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Upload New Certificate</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Title */}
          <FormFieldComponent
            control={form.control}
            name="title"
            label="Certificate Title"
            type="input"
            placeholder="Enter certificate title"
          />

          {/* Description */}
          <FormFieldComponent
            control={form.control}
            name="description"
            label="Description"
            type="textarea"
            placeholder="Enter certificate description (optional)"
          />

          {/* Issued By */}
          <FormFieldComponent
            control={form.control}
            name="issuedBy"
            label="Issued By"
            type="input"
            placeholder="Enter issuing organization"
          />

          {/* Issued Date */}
          <FormFieldComponent
            control={form.control}
            name="issuedDate"
            label="Issued Date"
            type="input"
            inputType="date"
            placeholder="Select issued date"
          />

          {/* Expiry Date */}
          <FormFieldComponent
            control={form.control}
            name="expiryDate"
            label="Expiry Date"
            type="input"
            inputType="date"
            placeholder="Select expiry date (optional)"
          />

          {/* Certificate Number */}
          <FormFieldComponent
            control={form.control}
            name="certificateNumber"
            label="Certificate Number"
            type="input"
            placeholder="Enter certificate number (optional)"
          />

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Certificate File *
            </label>
            <ImagesDropzone
              maxFiles={1}
              maxSize={10 * 1024 * 1024} // 10MB
              acceptedFormats={[
                "application/pdf",
                "image/jpeg",
                "image/jpg",
                "image/png",
              ]}
              onFilesChange={setSelectedFiles}
            />
            <p className="text-xs text-gray-500">
              Upload one PDF, JPEG, JPG, or PNG file (max 10MB)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="px-8 py-2.5 text-xl font-roboto font-medium"
              disabled={isLoading || selectedFiles.length === 0}
            >
              {isLoading ? "Uploading..." : "Upload Certificate"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CertificateForm;
