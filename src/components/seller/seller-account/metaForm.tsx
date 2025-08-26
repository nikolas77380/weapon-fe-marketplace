"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SellerFormValues, sellerSchema } from "@/schemas/sellerSchema";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES, isSeller, SELLER_TYPES } from "@/lib/utils";
import { UserProfile } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

import { createSellerMeta, updateSellerMeta } from "@/lib/strapi";
import { getSessionTokenFromCookie } from "@/lib/auth";

const MetaForm = ({ currentUser }: { currentUser: UserProfile }) => {
  const { metadata } = currentUser;
  const [isLoading, setIsLoading] = useState(false);

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
          data: values,
          token,
        });
        console.log("Create response:", response);
        toast.success("Seller information created successfully!");
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Error saving seller data:", error);

      // More detailed error handling
      if (error.message?.includes("403")) {
        toast.error(
          "Access denied. Please check your authentication and permissions."
        );
      } else if (error.message?.includes("401")) {
        toast.error("Authentication required. Please log in again.");
      } else if (error.message?.includes("400")) {
        toast.error("Invalid data. Please check your form inputs.");
      } else if (error.message?.includes("Only sellers can")) {
        toast.error(error.message);
      } else if (error.message?.includes("Invalid or expired token")) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(
          `Failed to save seller information: ${
            error.message || "Unknown error"
          }`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Specialisation */}
        <FormField
          name="specialisation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Business Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SELLER_TYPES.map(({ key, label, description }) => (
                    <SelectItem key={key} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seller */}
        <FormField
          control={form.control}
          name="sellerDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter company description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your company name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Web Site */}
        <FormField
          control={form.control}
          name="webSite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Web Site</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter company Web Site"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* phoneNumbers */}
        <FormField
          control={form.control}
          name="phoneNumbers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Numbers</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter company phone numbers with coma separated values if multiple"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* country */}
        <FormField
          name="country"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map(({ name, iso2 }) => (
                    <SelectItem key={iso2} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter company address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
  );
};

export default MetaForm;
