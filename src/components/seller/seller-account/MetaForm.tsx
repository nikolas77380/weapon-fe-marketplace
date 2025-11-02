"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldComponent from "@/components/ui/FormFieldComponent";

import { Button } from "@/components/ui/button";
import { SellerFormValues, sellerSchema } from "@/schemas/sellerSchema";

import { COUNTRIES, isSeller, SELLER_TYPES } from "@/lib/utils";
import { UserProfile } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import ImagesDropzone from "@/components/ui/ImagesDropzone";
import Image from "next/image";

import { createSellerMeta, updateSellerMeta } from "@/lib/strapi";
import { getSessionTokenFromCookie, getCurrentUser } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import CertificateForm from "./CertificateForm";
import CertificatesList from "./CertificatesList";
import { useTranslations, useLocale } from "next-intl";
import { useUploadSellerAvatar } from "@/hooks/useUploadSellerAvatar";
import WorkTimeField from "@/components/ui/WorkTimeField";

const MetaForm = ({
  currentUser,
  onSuccess,
  onUserUpdate,
}: {
  currentUser: UserProfile;
  onSuccess?: () => void;
  onUserUpdate?: (updatedUser: UserProfile) => void;
}) => {
  const t = useTranslations("Settings");
  const locale = useLocale();

  const { metadata } = currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [, setRefreshCertificates] = useState(0);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);

  const uploadAvatarMutation = useUploadSellerAvatar();

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      specialisation: metadata?.specialisation || "",
      sellerDescription: metadata?.sellerDescription || "",
      companyName: metadata?.companyName || "",
      businessId: metadata?.businessId || "",
      webSite: metadata?.webSite || "",
      phoneNumbers: metadata?.phoneNumbers || "",
      country: metadata?.country || "UA",
      address: metadata?.address || "",
      workTimeMonFri: metadata?.workTimeMonFri || "09:00-18:00",
      workTimeSaturday: metadata?.workTimeSaturday || "10:00-16:00",
      workTimeSunday: metadata?.workTimeSunday || "closed",
    },
  });

  const handleSubmit = async (values: SellerFormValues) => {
    setIsLoading(true);
    try {
      // Get JWT token using utility function
      const token = getSessionTokenFromCookie();

      if (!token) {
        throw new Error("No authentication token found");
      }

      if (!isSeller(currentUser)) {
        throw new Error("Only sellers can create seller meta data");
      }

      console.log(
        "Submitting seller data with token:",
        token.substring(0, 20) + "..."
      );
      console.log("Seller data:", values);

      let metaId: number;

      if (metadata) {
        // Update existing seller meta
        const response = await updateSellerMeta({
          id: metadata.id,
          data: values,
          token,
        });
        console.log("Update response:", response);
        metaId = metadata.id;
      } else {
        // Create new seller meta
        const response = await createSellerMeta({
          data: { ...values, webSite: values.webSite ?? "" },
          token,
        });
        console.log("Create response:", response);
        // Get the ID from the response
        metaId = response.data?.id || response.id;
      }

      // Upload avatar separately if provided
      if (avatarFiles.length > 0 && metaId) {
        await uploadAvatarMutation.mutateAsync({
          id: metaId,
          avatar: avatarFiles[0],
        });
      }

      toast.success(metadata ? t("toastUpdate") : t("toastCreate"));

      // Обновляем данные пользователя после успешного сохранения
      try {
        const updatedUser = await getCurrentUser(token);
        if (updatedUser && "id" in updatedUser && onUserUpdate) {
          onUserUpdate(updatedUser);
        }
      } catch (updateError) {
        console.error("Error updating user data:", updateError);
        // Не показываем ошибку пользователю, так как основная операция прошла успешно
      }

      // Переключаем на первый таб после успешного сохранения
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Error saving seller data:", error);

      // More detailed error handling
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("403")) {
        toast.error(
          "Access denied. Please check your authentication and permissions."
        );
      } else if (errorMessage.includes("401")) {
        toast.error("Authentication required. Please log in again.");
      } else if (errorMessage.includes("400")) {
        toast.error("Invalid data. Please check your form inputs.");
      } else if (errorMessage.includes("Only sellers can")) {
        toast.error(errorMessage);
      } else if (errorMessage.includes("Invalid or expired token")) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(`Failed to save seller information: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Breadcrumb - Hidden on mobile, visible on desktop */}
      {/* <div className="hidden md:block">
        <BreadcrumbComponent currentUser={currentUser} className="mt-4 mb-10" />
      </div> */}

      <div className="mt-4 md:mt-0">
        <div className=" w-full flex items-center justify-center">
          <Tabs defaultValue="companyDetails" className="w-full h-full">
            <TabsList
              className="bg-gray-100 flex flex-col min-[400px]:flex-row 
            min-[400px]:w-auto w-full h-full rounded-sm"
            >
              <TabsTrigger
                value="companyDetails"
                className="text-sm sm:text-base w-full min-[400px]:w-auto h-full py-2"
              >
                {t("titleCompanyDetails")}
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                className="text-sm sm:text-base w-full min-[400px]:w-auto h-full py-2"
              >
                {t("titleCertificates")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="companyDetails" className="mt-6 md:mt-10 h-fit">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  {/* Business Type */}
                  <FormFieldComponent
                    control={form.control}
                    name="specialisation"
                    label={t("labelBusinessType")}
                    type="select"
                    placeholder={t("placeholderBusinessType")}
                    className="w-full min-[600px]:w-1/2 rounded-sm"
                    defaultValue={undefined}
                    options={SELLER_TYPES.map(({ key, label, ua }) => ({
                      key,
                      label: locale === "ua" ? ua : label,
                      value: locale === "ua" ? ua : label,
                    }))}
                  />

                  {/* Description */}
                  <FormFieldComponent
                    control={form.control}
                    name="sellerDescription"
                    label={t("labelDescription")}
                    type="textarea"
                    placeholder={t("placeholderDescription")}
                  />

                  {/* Company Name */}
                  <FormFieldComponent
                    control={form.control}
                    name="companyName"
                    label={t("labelCompanyName")}
                    type="input"
                    placeholder={t("placeholderCompanyName")}
                    classNameLabel="bg-background"
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />

                  {/* Business ID */}
                  <FormFieldComponent
                    control={form.control}
                    name="businessId"
                    label={t("labelBusinessId")}
                    type="input"
                    placeholder={t("placeholderBusinessId")}
                    classNameLabel="bg-background"
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />

                  {/* Web Site */}
                  <FormFieldComponent
                    control={form.control}
                    name="webSite"
                    label={t("labelWebSite")}
                    type="input"
                    placeholder={t("placeholderWebSite")}
                    classNameLabel="bg-background"
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {/* phoneNumbers */}
                  <FormFieldComponent
                    control={form.control}
                    name="phoneNumbers"
                    label={t("labelPhoneNumbers")}
                    type="input"
                    placeholder={t("placeholderPhoneNumbers")}
                    classNameLabel="bg-background"
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {/* country */}
                  <FormFieldComponent
                    control={form.control}
                    name="country"
                    label={t("labelCountry")}
                    type="select"
                    placeholder={t("placeholderCountry")}
                    className="w-full min-[600px]:w-1/2 rounded-sm"
                    defaultValue={undefined}
                    options={COUNTRIES.map(({ name, iso2, ua }) => ({
                      key: iso2,
                      label: locale === "ua" ? ua : name,
                      value: iso2,
                    }))}
                  />
                  {/* address */}
                  <FormFieldComponent
                    control={form.control}
                    name="address"
                    label={t("labelAddress")}
                    type="input"
                    placeholder={t("placeholderAddress")}
                    classNameLabel="bg-background"
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />

                  {/* Working Hours */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("workTime.title")}
                    </h3>

                    <WorkTimeField
                      label={t("workTime.monFri")}
                      value={form.watch("workTimeMonFri") || "09:00-18:00"}
                      onChange={(value) =>
                        form.setValue("workTimeMonFri", value)
                      }
                      showNonWorkingCheckbox={false}
                    />

                    <WorkTimeField
                      label={t("workTime.saturday")}
                      value={form.watch("workTimeSaturday") || "10:00-16:00"}
                      onChange={(value) =>
                        form.setValue("workTimeSaturday", value)
                      }
                      showNonWorkingCheckbox={true}
                    />

                    <WorkTimeField
                      label={t("workTime.sunday")}
                      value={form.watch("workTimeSunday") || "closed"}
                      onChange={(value) =>
                        form.setValue("workTimeSunday", value)
                      }
                      showNonWorkingCheckbox={true}
                    />
                  </div>

                  {/* Avatar Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("labelAvatar")}
                    </label>

                    {/* Show current avatar if exists and no new file selected */}
                    {metadata?.avatar && avatarFiles.length === 0 && (
                      <div className="mb-4 p-4 border border-border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">
                          {t("labelCurrentAvatar")}
                        </p>
                        <div className="relative w-32 h-32">
                          <Image
                            src={metadata.avatar.url}
                            alt="Current avatar"
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    <ImagesDropzone
                      maxFiles={1}
                      onFilesChange={setAvatarFiles}
                      externalFiles={avatarFiles}
                      enableCrop={true}
                      cropShape="circle"
                      acceptedFormats={[
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/webp",
                      ]}
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <Button
                      type="submit"
                      className="w-full min-[400px]:w-auto px-2 min-[340px]:px-4 min-[400px]:px-6 sm:px-8.5 
                      py-2 min-[400px]:py-2 sm:py-2.5 text-xs min-[340px]:text-sm text-white hover:bg-gold-main/90
                      min-[400px]:text-base bg-gold-main sm:text-lg font-medium whitespace-normal text-center leading-tight"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? t("buttonSaving")
                        : metadata
                        ? t("buttonUpdate")
                        : t("buttonSubmit")}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="certificates" className="mt-6 md:mt-10">
              <div className="space-y-8">
                {/* Existing Certificates List */}
                <div className="pt-8">
                  <CertificatesList
                    currentUser={currentUser}
                    onRefresh={() => setRefreshCertificates((prev) => prev + 1)}
                  />
                </div>
                {/* Upload New Certificate Form */}
                <CertificateForm
                  currentUser={currentUser}
                  onSuccess={() => setRefreshCertificates((prev) => prev + 1)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MetaForm;
