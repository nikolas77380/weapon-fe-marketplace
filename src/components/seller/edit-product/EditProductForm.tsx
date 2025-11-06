"use client";

import React, { useEffect, useRef, useCallback } from "react";
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
import {
  getProductConditionOptions,
  getProductStatusOptions,
  getProductAccessibilityOptions,
} from "@/lib/utils";
import { toast } from "sonner";
import ImagesDropzone from "@/components/ui/ImagesDropzone";
import { useCategories } from "@/hooks/useCategories";
import { useProductActions } from "@/hooks/useProductsQuery";
import { Product, UpdateProductData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { X } from "lucide-react";
import CategoryCombobox from "@/components/ui/CategoryCombobox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditProductFormProps {
  product: Product;
  customLabels?: Record<string, string>;
}

const EditProductForm = ({
  product,
  customLabels: _customLabels = {},
}: EditProductFormProps) => {
  const t = useTranslations("EditProduct");
  const tAddProduct = useTranslations("AddProduct.addProductForm");
  const tCondition = useTranslations(
    "AddProduct.addProductForm.productCondition"
  );
  const tStatus = useTranslations("AddProduct.addProductForm.productStatus");
  const tAccessibility = useTranslations(
    "AddProduct.addProductForm.productAccessibility"
  );

  const router = useRouter();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    updateProduct,
    loading: updateLoading,
    error: updateError,
  } = useProductActions();

  void _customLabels;

  // Get price for selected currency from product
  const getPriceForCurrency = useCallback(
    (currency: "USD" | "EUR" | "UAH"): number => {
      switch (currency) {
        case "USD":
          return product.priceUSD || 0;
        case "EUR":
          return product.priceEUR || 0;
        case "UAH":
          return product.priceUAH || 0;
        default:
          return 0;
      }
    },
    [product.priceUSD, product.priceEUR, product.priceUAH]
  );

  // Determine initial price and currency from product (default to USD)
  const getInitialPriceAndCurrency = useCallback(() => {
    // Default to USD if available
    if (product.priceUSD && product.priceUSD > 0) {
      return { price: product.priceUSD, currency: "USD" as const };
    }
    // Fallback to EUR
    if (product.priceEUR && product.priceEUR > 0) {
      return { price: product.priceEUR, currency: "EUR" as const };
    }
    // Fallback to UAH
    if (product.priceUAH && product.priceUAH > 0) {
      return { price: product.priceUAH, currency: "UAH" as const };
    }
    return { price: 0, currency: "USD" as const };
  }, [product.priceUSD, product.priceEUR, product.priceUAH]);

  const initialPriceData = getInitialPriceAndCurrency();

  const form = useForm<EditProductSchemaValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: product.title || "",
      description: product.description || "",
      price: initialPriceData.price,
      currency: initialPriceData.currency,
      category: product.category?.id.toString() || "0",
      sku: product.sku || "",
      status: product.status || "available",
      condition: product.condition || "new",
      activityStatus: product.activityStatus || undefined,
      quantity: product.attributesJson?.count || undefined,
      manufacturer: product.attributesJson?.manufacturer || "",
      model: product.attributesJson?.model || "",
      videoUrl: product.videoUrl || "",
      images: undefined,
    },
  });

  // Update form when product changes
  useEffect(() => {
    if (product) {
      const priceData = getInitialPriceAndCurrency();
      form.reset({
        title: product.title || "",
        description: product.description || "",
        price: priceData.price,
        currency: priceData.currency,
        category: product.category?.id.toString() || "0",
        sku: product.sku || "",
        status: product.status || "available",
        condition: product.condition || "new",
        activityStatus: product.activityStatus || undefined,
        quantity: product.attributesJson?.count || undefined,
        manufacturer: product.attributesJson?.manufacturer || "",
        model: product.attributesJson?.model || "",
        videoUrl: product.videoUrl || "",
        images: undefined,
      });
    }
  }, [
    form,
    product,
    product.id,
    product.title,
    product.description,
    product.priceUSD,
    product.priceEUR,
    product.priceUAH,
    product.category?.id,
    product.sku,
    product.status,
    product.condition,
    product.activityStatus,
    product.videoUrl,
    product.attributesJson?.count,
    product.attributesJson?.manufacturer,
    product.attributesJson?.model,
    getInitialPriceAndCurrency,
  ]);

  // Watch currency changes and update price from product
  const watchedCurrency = form.watch("currency");
  const prevCurrencyRef = useRef<string | undefined>(initialPriceData.currency);

  // Update ref when product changes
  useEffect(() => {
    prevCurrencyRef.current = initialPriceData.currency;
  }, [product.id, initialPriceData.currency]);

  useEffect(() => {
    if (
      watchedCurrency &&
      product &&
      prevCurrencyRef.current !== watchedCurrency
    ) {
      const priceForCurrency = getPriceForCurrency(
        watchedCurrency as "USD" | "EUR" | "UAH"
      );
      form.setValue("price", priceForCurrency);
      prevCurrencyRef.current = watchedCurrency;
    }
  }, [watchedCurrency, form, product, getPriceForCurrency]);

  // Deletion dialog is currently disabled

  const onSubmit = async (values: EditProductSchemaValues) => {
    try {
      const updateData: UpdateProductData = {
        title: values.title,
        description: values.description,
        price: values.price,
        currency: values.currency,
        category: values.category,
        sku: values.sku,
        status: values.status,
        condition: values.condition,
        activityStatus: values.activityStatus,
        videoUrl:
          values.videoUrl && values.videoUrl.trim() !== ""
            ? values.videoUrl.trim()
            : undefined,
        attributesJson: {
          ...(values.quantity !== undefined && values.quantity !== null
            ? { count: values.quantity }
            : {}),
          manufacturer: values.manufacturer,
          model: values.model,
        },
      };

      await updateProduct({
        id: product.id.toString(),
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
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 w-full mb-10">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          {t("titleEditProduct")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t("descriptionEditProduct")}
        </p>
      </div>

      {product.images && product.images.length > 0 && (
        <div className="mb-4 flex items-center flex-wrap w-full gap-4">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="relative size-30 border border-border rounded-sm"
            >
              <Image
                src={image.url}
                alt={image.name}
                fill
                priority
                className="object-contain size-full p-2"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white 
                    rounded-full group p-2 cursor-pointer transition duration-300 ease-in-out"
                  >
                    <X className="h-4 w-4 group-hover:text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("deleteModal.buttonDelete")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
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
            classNameLabel="bg-background outline-none"
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
          <div className="flex flex-col gap-4">
            <FormFieldComponent
              control={form.control}
              name="currency"
              label={t("labelCurrency")}
              type="select"
              className="w-full sm:w-32 rounded-sm"
              classNameLabel="bg-background"
              options={[
                { key: "USD", label: "USD", value: "USD" },
                { key: "EUR", label: "EUR", value: "EUR" },
                { key: "UAH", label: "UAH", value: "UAH" },
              ]}
            />
            <FormFieldComponent
              control={form.control}
              name="price"
              label={t("labelPrice")}
              type="input"
              inputType="number"
              placeholder="0.00"
              className="w-2xs"
              classNameLabel="bg-background"
              min="0.01"
              step="0.01"
              customOnChange={(e, fieldOnChange) => {
                const value = e.target.value;
                const numValue =
                  value === "" ? 0 : Math.max(0.01, Number(value));
                fieldOnChange(numValue);
              }}
            />
          </div>

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labelCategory")}</FormLabel>
                <FormControl>
                  <CategoryCombobox
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    categories={categories}
                    loading={categoriesLoading}
                    error={categoriesError}
                    placeholder={tAddProduct("placeholderCategory")}
                    className="w-full rounded-sm"
                  />
                </FormControl>
                {categoriesError && (
                  <p className="text-sm text-red-500 mt-1">
                    {tAddProduct("errorCategories")}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Accessibility */}
          <FormFieldComponent
            control={form.control}
            name="activityStatus"
            label={tAccessibility("label")}
            type="select"
            placeholder={tAccessibility("placeholder")}
            className="w-full rounded-sm"
            options={getProductAccessibilityOptions((key: string) =>
              tAccessibility(key)
            )}
          />

          {/* Condition and Status on the next row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <FormFieldComponent
              control={form.control}
              className="rounded-sm"
              name="condition"
              label={t("labelCondition")}
              type="select"
              placeholder="Select condition"
              options={getProductConditionOptions(tCondition)}
            />

            <FormFieldComponent
              control={form.control}
              className="rounded-sm"
              name="status"
              label={t("labelStatus")}
              type="select"
              placeholder="Select status"
              options={getProductStatusOptions(tStatus)}
            />
          </div>

          {/* SKU and Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormFieldComponent
              control={form.control}
              name="sku"
              label={t("labelSku")}
              type="input"
              placeholder={t("placeholderSku")}
              classNameLabel="bg-background"
            />

            <FormFieldComponent
              control={form.control}
              name="quantity"
              label={t("labelCount")}
              type="input"
              inputType="number"
              min="0"
              placeholder=""
              classNameLabel="bg-background"
              customOnChange={(e, fieldOnChange) => {
                const value = e.target.value;
                if (value === "") {
                  fieldOnChange(undefined);
                } else {
                  const numValue = Number(value);
                  if (numValue >= 0) {
                    fieldOnChange(numValue);
                  } else {
                    fieldOnChange(undefined);
                  }
                }
              }}
            />
          </div>

          {/* Manufacturer and Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

          {/* Video URL */}
          <FormFieldComponent
            control={form.control}
            name="videoUrl"
            label={t("labelVideoUrl")}
            type="input"
            placeholder={
              t("placeholderVideoUrl") || "https://example.com/video"
            }
            className="w-full"
            classNameLabel="bg-background"
          />

          {/* Submit Buttons - 2 buttons side by side */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button
              type="submit"
              disabled={updateLoading}
              className="w-full sm:flex-1 py-2.5 sm:py-2 rounded-sm bg-gold-main hover:bg-gold-main/90 text-white text-sm sm:text-base"
            >
              {updateLoading ? t("buttonUpdating") : t("buttonUpdate")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/account")}
              className="w-full sm:flex-1 py-2.5 sm:py-2 rounded-sm text-sm sm:text-base"
            >
              {t("buttonCancel")}
            </Button>
          </div>

          {/* Temporary debugging */}
          {updateError && (
            <div className="text-red-500 text-sm mt-2">
              {t("error")} {updateError.message || t("errorDescription")}
            </div>
          )}
        </form>
      </Form>
      {/* <DeleteImageDialog
        isOpen={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setImageToDelete(null);
        }}
        onConfirm={handleDeleteImage}
      /> */}
    </div>
  );
};

export default EditProductForm;
