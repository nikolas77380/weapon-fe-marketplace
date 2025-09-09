"use client";

import React, { useEffect } from "react";
import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { useForm } from "react-hook-form";
import {
  editProductSchema,
  EditProductSchemaValues,
} from "@/schemas/editProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { PRODUCT_CONDITION_FORM } from "@/lib/utils";
import { toast } from "sonner";
import ImagesDropzone from "@/components/ui/ImagesDropzone";
import { useCategories } from "@/hooks/useCategories";
import { useProductActions } from "@/hooks/useProducts";
import { Product, UpdateProductData } from "@/lib/types";
import { useRouter } from "next/navigation";

interface EditProductFormProps {
  product: Product;
}

const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter();

  const { categories } = useCategories();

  const {
    updateProduct,
    loading: updateLoading,
    error: updateError,
  } = useProductActions();

  const form = useForm<EditProductSchemaValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: product.title || "",
      description: product.description || "",
      price: product.price || 0,
      category: product.category?.id || 0,
      sku: product.sku || "",
      status: product.status || "available",
      condition: product.attributesJson?.condition || "New",
      quantity: product.attributesJson?.count || 1,
      manufacturer: product.attributesJson?.manufacturer || "",
      model: product.attributesJson?.model || "",
      images: undefined,
    },
  });

  // Update form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category?.id || 0,
        sku: product.sku || "",
        status: product.status || "available",
        condition: product.attributesJson?.condition || "new",
        quantity: product.attributesJson?.count || 1,
        manufacturer: product.attributesJson?.manufacturer || "",
        model: product.attributesJson?.model || "",
        images: undefined,
      });
    }
  }, [
    product.id,
    product.title,
    product.description,
    product.price,
    product.category?.id,
    product.sku,
    product.status,
    product.attributesJson?.condition,
    product.attributesJson?.count,
    product.attributesJson?.manufacturer,
    product.attributesJson?.model,
  ]);

  const onSubmit = async (values: EditProductSchemaValues) => {
    try {
      const updateData: UpdateProductData = {
        title: values.title,
        description: values.description,
        price: values.price,
        currency: "USD", // Always use USD
        category: values.category,
        sku: values.sku,
        status: values.status,
        attributesJson: {
          condition: values.condition,
          count: values.quantity,
          manufacturer: values.manufacturer,
          model: values.model,
        },
      };

      await updateProduct(product.id, updateData, values.images);

      toast.success("Product updated successfully!");
      router.push("/account");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Edit Product</h1>
        <p className="text-gray-600">Update your product information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <ImagesDropzone
                    maxFiles={5}
                    onFilesChange={(files) => {
                      field.onChange(files);
                      console.log("Images updated in form:", files);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormFieldComponent
            control={form.control}
            name="title"
            label="Product Title"
            type="input"
            placeholder="Enter product title"
          />

          {/* Description */}
          <FormFieldComponent
            control={form.control}
            name="description"
            label="Description"
            type="textarea"
            placeholder="Describe your product..."
            rows={4}
          />

          {/* Price */}
          <FormFieldComponent
            control={form.control}
            name="price"
            label="Price (USD)"
            type="input"
            inputType="number"
            placeholder="0.00"
            className="w-1/2"
            customOnChange={(e, fieldOnChange) =>
              fieldOnChange(Number(e.target.value))
            }
          />

          {/* Category */}
          <FormFieldComponent
            control={form.control}
            name="category"
            label="Category"
            type="select"
            placeholder="Select category"
            onValueChange={(value) => Number(value)}
            selectValue={undefined}
            customSelectOptions={
              <>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </>
            }
          />

          {/* SKU and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldComponent
              control={form.control}
              name="sku"
              label="SKU"
              type="input"
              placeholder="Product SKU"
            />

            <FormFieldComponent
              control={form.control}
              name="status"
              label="Status"
              type="select"
              placeholder="Select status"
              options={[
                { key: "available", label: "Available" },
                { key: "reserved", label: "Reserved" },
                { key: "sold", label: "Sold" },
                { key: "archived", label: "Archived" },
              ]}
            />
          </div>

          {/* Condition and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldComponent
              control={form.control}
              name="condition"
              label="Condition"
              type="select"
              placeholder="Select condition"
              options={PRODUCT_CONDITION_FORM}
            />

            <FormFieldComponent
              control={form.control}
              name="quantity"
              label="Quantity"
              type="input"
              inputType="number"
              min="1"
              placeholder="1"
              customOnChange={(e, fieldOnChange) =>
                fieldOnChange(Number(e.target.value))
              }
            />
          </div>

          {/* Manufacturer and Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldComponent
              control={form.control}
              name="manufacturer"
              label="Manufacturer"
              type="input"
              placeholder="Enter manufacturer"
            />

            <FormFieldComponent
              control={form.control}
              name="model"
              label="Model"
              type="input"
              placeholder="Enter model"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateLoading}
              className="flex-1 py-2"
            >
              {updateLoading ? "Updating..." : "Update Product"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/account")}
              className="flex-1 py-2"
            >
              Cancel
            </Button>
          </div>

          {/* Temporary debugging */}
          {updateError && (
            <div className="text-red-500 text-sm mt-2">
              Error: {updateError}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EditProductForm;
