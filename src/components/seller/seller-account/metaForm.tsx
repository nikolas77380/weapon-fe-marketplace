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

import { createSellerMeta, updateSellerMeta } from "@/lib/strapi";
import { getSessionTokenFromCookie } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";
import { Form } from "@/components/ui/form";
import CertificateForm from "./CertificateForm";
import CertificatesList from "./CertificatesList";

const MetaForm = ({ currentUser }: { currentUser: UserProfile }) => {
  const { metadata } = currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [, setRefreshCertificates] = useState(0);

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      specialisation: metadata?.specialisation || "",
      sellerDescription: metadata?.sellerDescription || "",
      companyName: metadata?.companyName || "",
      webSite: metadata?.webSite || "",
      phoneNumbers: metadata?.phoneNumbers || "",
      country: metadata?.country || "UA",
      address: metadata?.address || "",
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

      if (metadata) {
        // Update existing seller meta
        const response = await updateSellerMeta({
          id: metadata.id,
          data: values,
          token,
        });
        console.log("Update response:", response);
        toast.success("Seller information updated successfully!");
      } else {
        // Create new seller meta
        const response = await createSellerMeta({
          data: { ...values, webSite: values.webSite ?? "" },
          token,
        });
        console.log("Create response:", response);
        toast.success("Seller information created successfully!");
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
    <div className="container mx-auto w-full">
      <BreadcrumbComponent currentUser={currentUser} className="mt-4 mb-10" />
      <div className="max-w-5xl mx-auto w-full flex items-center justify-center">
        <Tabs defaultValue="companyDetails" className="w-full">
          <TabsList className="bg-gray-primary gap-5 flex w-full">
            <TabsTrigger value="companyDetails">Company Details</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>
          <TabsContent value="companyDetails" className="mt-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Specialisation */}
                <FormFieldComponent
                  control={form.control}
                  name="specialisation"
                  label="Business Type"
                  type="select"
                  placeholder="Select Business Type"
                  defaultValue={undefined}
                  options={SELLER_TYPES.map(({ key, label }) => ({
                    key,
                    label,
                    value: label,
                  }))}
                />

                {/* Seller */}
                <FormFieldComponent
                  control={form.control}
                  name="sellerDescription"
                  label="Description"
                  type="textarea"
                  placeholder="Enter company description"
                />

                {/* Company Name */}
                <FormFieldComponent
                  control={form.control}
                  name="companyName"
                  label="Company Name"
                  type="input"
                  placeholder="Enter your company name"
                />

                {/* Web Site */}
                <FormFieldComponent
                  control={form.control}
                  name="webSite"
                  label="Web Site"
                  type="input"
                  placeholder="Enter company Web Site"
                />
                {/* phoneNumbers */}
                <FormFieldComponent
                  control={form.control}
                  name="phoneNumbers"
                  label="Phone Numbers"
                  type="input"
                  placeholder="Enter company phone numbers with coma separated values if multiple"
                />
                {/* country */}
                <FormFieldComponent
                  control={form.control}
                  name="country"
                  label="Country"
                  type="select"
                  placeholder="Select Country"
                  defaultValue={undefined}
                  options={COUNTRIES.map(({ name, iso2 }) => ({
                    key: iso2,
                    label: name,
                    value: name,
                  }))}
                />
                {/* address */}
                <FormFieldComponent
                  control={form.control}
                  name="address"
                  label="Address"
                  type="input"
                  placeholder="Enter company address"
                />
                <div className="flex items-center justify-center">
                  <Button
                    type="submit"
                    className="px-8.5 py-2.5 text-xl font-roboto font-medium"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Saving..."
                      : metadata
                      ? "Update Company Details"
                      : "Submit Company Details"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="certificates" className="mt-10">
            <div className="space-y-8">
              {/* Existing Certificates List */}
              <div className="border-t pt-8">
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
  );
};

export default MetaForm;
