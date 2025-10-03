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
import { useTranslations } from "next-intl";

interface CertificateFormProps {
  currentUser: UserProfile;
  onSuccess?: () => void;
}

const CertificateForm = ({ onSuccess }: CertificateFormProps) => {
  const t = useTranslations("Settings.certificatesForm");

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
      toast.error(t("toastErrorSelectFile1"));
      return;
    }

    // Validate that we have exactly one file (as per schema)
    if (selectedFiles.length > 1) {
      toast.error(t("toastErrorSelectFile2"));
      return;
    }

    setIsLoading(true);
    try {
      const certificateData = {
        ...values,
        certificateType: "seller" as const,
        status: "active" as const,
      };

      await createCertificate({ data: certificateData, files: selectedFiles });

      toast.success(t("toastSuccessUpload"));

      // Reset form
      form.reset();
      setSelectedFiles([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Error uploading certificate:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        response: (error as { response?: unknown })?.response,
      });

      // More detailed error handling
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        (
          error as {
            response?: {
              data?: { error?: { message?: string }; message?: string };
            };
          }
        )?.response?.data?.error?.message
      ) {
        errorMessage = (
          error as { response: { data: { error: { message: string } } } }
        ).response.data.error.message;
      } else if (
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message
      ) {
        errorMessage = (error as { response: { data: { message: string } } })
          .response.data.message;
      }

      toast.error(`t('toastErrorUpload') ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {t("titleUploadCertificate")}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Title */}
          <FormFieldComponent
            control={form.control}
            name="title"
            label={t("labelCertificateTitle")}
            type="input"
            placeholder={t("placeholderCertificateTitle")}
            classNameLabel="bg-background"
            className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Description */}
          <FormFieldComponent
            control={form.control}
            name="description"
            label={t("labelDescription")}
            type="textarea"
            placeholder={t("placeholderDescription")}
          />

          {/* Issued By */}
          <FormFieldComponent
            control={form.control}
            name="issuedBy"
            label={t("labelIssuedBy")}
            type="input"
            placeholder={t("placeholderIssuedBy")}
            classNameLabel="bg-background"
            className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Issued Date */}
          <FormFieldComponent
            control={form.control}
            name="issuedDate"
            label={t("labelIssuedDate")}
            type="input"
            inputType="date"
            placeholder={t("placeholderIssuedDate")}
            classNameLabel="bg-background"
            className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Expiry Date */}
          <FormFieldComponent
            control={form.control}
            name="expiryDate"
            label={t("labelExpiryDate")}
            type="input"
            inputType="date"
            placeholder={t("placeholderExpiryDate")}
            classNameLabel="bg-background"
            className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Certificate Number */}
          <FormFieldComponent
            control={form.control}
            name="certificateNumber"
            label={t("labelCertificateNumber")}
            type="input"
            placeholder={t("placeholderCertificateNumber")}
            classNameLabel="bg-background"
            className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("labelCertificateFile")} *
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
              externalFiles={selectedFiles}
            />
            <p className="text-xs text-gray-500">
              {t("titlenUploadOne")} PDF, JPEG, JPG, or PNG file ({t("descMax")}{" "}
              10MB)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full min-[400px]:w-auto px-2 min-[340px]:px-4 min-[400px]:px-8 py-2 min-[400px]:py-2.5 text-xs min-[340px]:text-sm min-[400px]:text-base sm:text-xl font-roboto font-medium whitespace-normal text-center leading-tight"
              disabled={isLoading || selectedFiles.length === 0}
            >
              {isLoading ? t("buttonUploading") : t("buttonUpload")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CertificateForm;
