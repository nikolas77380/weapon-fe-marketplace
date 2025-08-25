"use client";

import { UserProfile } from "@/lib/types";
import { createSellerMeta, updateSellerMeta } from "@/lib/strapi";
import MetaForm from "./metaForm";
import { SellerFormValues } from "@/schemas/sellerSchema";
import { useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { getSessionTokenFromCookie, getUserFromToken } from "@/lib/auth";
import { isSeller } from "@/lib/utils";

const SellerAccount = ({ currentUser }: { currentUser: UserProfile }) => {
  const { metadata } = currentUser;
  const [isLoading, setIsLoading] = useState(false);

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

      // Optionally refresh the page or update the user data
      redirect("/marketplace");
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

  if (metadata === null || metadata === undefined) {
    return <MetaForm onSubmit={handleSubmit} isLoading={isLoading} />;
  }

  return (
    <div>
      <h2>Seller Account</h2>
      <p>Your seller information has been saved.</p>
      {/* You can add a form to edit existing data here */}
    </div>
  );
};

export default SellerAccount;
