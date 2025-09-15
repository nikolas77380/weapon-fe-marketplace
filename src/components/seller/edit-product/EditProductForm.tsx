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
import { useProductActions } from "@/hooks/useProductsQuery";
import { Product, UpdateProductData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface EditProductFormProps {
  product: Product;
}

const EditProductForm = ({ product }: EditProductFormProps) => {
  const t = useTranslations("EditProduct");

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

      await updateProduct({
        id: product.id,
        data: updateData,
        images: values.images,
      });

      toast.success(t("toastSuccessUpdate"));
      router.push("/account");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(t("toastErrorUpdate"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 w-full mb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t("titleEditProduct")}</h1>
        <p className="text-gray-600">{t("descriptionEditProduct")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labelProductImages")}</FormLabel>
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
            label={t("labelProductName")}
            type="input"
            placeholder={t("placeholderProductName")}
            classNameLabel="bg-background"
          />

          {/* Description */}
          <FormFieldComponent
            control={form.control}
            name="description"
            label={t("labelDescription")}
            type="textarea"
            placeholder={t("placeholderDescription")}
            rows={4}
          />

          {/* Price */}
          <FormFieldComponent
            control={form.control}
            name="price"
            label={t("labelPrice")}
            type="input"
            inputType="number"
            placeholder="0.00"
            className="w-1/2"
            classNameLabel="bg-background"
            customOnChange={(e, fieldOnChange) =>
              fieldOnChange(Number(e.target.value))
            }
          />
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-between items-center w-1/2">
              {/* Category */}
              <FormFieldComponent
                control={form.control}
                name="category"
                label={t("labelCategory")}
                type="select"
                placeholder="Select category"
                onValueChange={(value) => Number(value)}
                selectValue={undefined}
                customSelectOptions={
                  <>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </>
                }
              />

              {/* Condition and Quantity */}
              <FormFieldComponent
                control={form.control}
                name="condition"
                label={t("labelCondition")}
                type="select"
                placeholder="Select condition"
                options={PRODUCT_CONDITION_FORM}
              />
            </div>
            {/* Status */}
            <FormFieldComponent
              control={form.control}
              name="status"
              label={t("labelStatus")}
              type="select"
              placeholder="Select status"
              className="w-full"
              options={[
                { key: "available", label: "Available" },
                { key: "reserved", label: "Reserved" },
                { key: "sold", label: "Sold" },
                { key: "archived", label: "Archived" },
              ]}
            />
          </div>

          {/* SKU and Status */}
          <FormFieldComponent
            control={form.control}
            name="sku"
            label="SKU"
            type="input"
            placeholder="Product SKU"
            className="w-1/2"
            classNameLabel="bg-background"
          />

          <FormFieldComponent
            control={form.control}
            name="quantity"
            label={t("labelCount")}
            type="input"
            inputType="number"
            min="1"
            placeholder="1"
            classNameLabel="bg-background"
            customOnChange={(e, fieldOnChange) =>
              fieldOnChange(Number(e.target.value))
            }
          />

          {/* Manufacturer and Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldComponent
              control={form.control}
              name="manufacturer"
              label={t("labelManufacturer")}
              type="input"
              placeholder="Enter manufacturer"
              classNameLabel="bg-background"
            />

            <FormFieldComponent
              control={form.control}
              name="model"
              label={t("labelModel")}
              type="input"
              placeholder="Enter model"
              classNameLabel="bg-background"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateLoading}
              className="flex-1 py-2"
            >
              {updateLoading ? t('buttonUpdating') : t('buttonUpdate')}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/account")}
              className="flex-1 py-2"
            >
              {t('buttonCancel')}
            </Button>
          </div>

          {/* Temporary debugging */}
          {updateError && (
            <div className="text-red-500 text-sm mt-2">
              {t("error")} {updateError.message || t('errorDescription')}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EditProductForm;
