"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/FormFieldComponent";
import { useForm } from "react-hook-form";
import {
  createAddProductSchema,
  AddProductSchemaValues,
} from "@/schemas/addProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  STORAGE_KEY,
  getProductConditionOptions,
  getProductStatusOptions,
} from "@/lib/utils";
import { toast } from "sonner";
import ImagesDropzone from "@/components/ui/ImagesDropzone";
import { useCategories } from "@/hooks/useCategories";
import CategoryCombobox from "@/components/ui/CategoryCombobox";
import { useProductActions } from "@/hooks/useProductsQuery";
import { useTranslations, useLocale } from "next-intl";

const AddProductForms = ({
  onProductCreated,
}: {
  onProductCreated?: () => void;
}) => {
  const locale = useLocale();
  const t = useTranslations("AddProduct.addProductForm");
  const tCondition = useTranslations(
    "AddProduct.addProductForm.productCondition"
  );
  const tStatus = useTranslations("AddProduct.addProductForm.productStatus");

  const [savedFormData, setSavedFormData, removeSavedFormData] =
    useLocalStorage<AddProductSchemaValues | null>(STORAGE_KEY, null);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    createProduct,
    loading: createLoading,
    error: createError,
  } = useProductActions();

  const router = useRouter();

  // Create schema and resolver with translations - rebuild when translations or locale change
  const schema = useMemo(() => createAddProductSchema(t), [t]);
  const resolver = useMemo(() => zodResolver(schema), [schema]);

  const form = useForm<AddProductSchemaValues>({
    resolver,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      productName: "",
      productSku: "",
      productDescription: "",
      productCategory: "",
      productManufacturer: "",
      productModel: "",
      productCondition: "new" as "new" | "used",
      productPrice: 0,
      productCurrency: "USD" as "USD" | "EUR" | "UAH",
      productCount: 0,
      productImages: [],
      productStatus: "available",
      productVideoUrl: "",
    },
  });

  // Re-validate form when locale changes to update validation messages
  useEffect(() => {
    // Only re-validate if there are existing errors
    if (Object.keys(form.formState.errors).length > 0) {
      // Trigger validation again to get messages in new language
      form.trigger();
    }
  }, [locale, form]);

  useEffect(() => {
    if (savedFormData) {
      form.reset(savedFormData);
    }
    // Initialize productImages if it's undefined
    const currentImages = form.getValues("productImages");
    if (!currentImages || !Array.isArray(currentImages)) {
      form.setValue("productImages", []);
    }
  }, [savedFormData, form]);

  useEffect(() => {
    if (savedFormData && !form.getValues("productName")) {
      removeSavedFormData();
    }
  }, [form, removeSavedFormData, savedFormData]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const hasData = Object.values(values).some(
        (value) =>
          (typeof value === "string" && value.trim() !== "") ||
          (typeof value === "number" && value > 0)
      );

      if (hasData) {
        setSavedFormData(values as AddProductSchemaValues);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setSavedFormData]);

  useEffect(() => {
    if (createError) {
      toast.error(createError.message || "Failed to create product");
    }
  }, [createError]);

  const onSubmit = async (values: AddProductSchemaValues) => {
    // Ensure productImages is always an array before validation
    const currentImages = Array.isArray(values.productImages)
      ? values.productImages
      : [];
    if (currentImages.length === 0 || !Array.isArray(values.productImages)) {
      form.setValue("productImages", [], {
        shouldValidate: false,
        shouldTouch: true,
      });
    }

    // Trigger validation to show errors - this will mark all fields as touched after submit attempt
    const isValid = await form.trigger();

    // Force re-validation of productImages if it's empty
    if (!isValid) {
      await form.trigger("productImages");
      return;
    }
    try {
      const selectedCategory = categories.find(
        (cat) => cat.id.toString() === values.productCategory
      );

      if (!selectedCategory) {
        toast.error("Please select a valid category");
        return;
      }

      // Check that the leaf category (no children) is selected.
      const hasChildren = categories.some(
        (c) => c.parent?.id === selectedCategory.id
      );
      if (hasChildren) {
        toast.error("Please select a subcategory, not a parent category");
        return;
      }

      const productData = {
        title: values.productName,
        description: values.productDescription,
        price: values.productPrice,
        currency: values.productCurrency,
        category: selectedCategory.id,
        sku: values.productSku || undefined,
        status: values.productStatus,
        condition: values.productCondition,
        videoUrl:
          values.productVideoUrl && values.productVideoUrl.trim() !== ""
            ? values.productVideoUrl.trim()
            : undefined,
        attributesJson: {
          manufacturer: values.productManufacturer,
          model: values.productModel,
          count: values.productCount,
        },
      };

      await createProduct({
        data: productData,
        images: values.productImages,
      });

      // Clear localStorage and reset the form
      removeSavedFormData();

      // Resetting the form to its initial values
      form.reset({
        productName: "",
        productDescription: "",
        productCategory: "",
        productManufacturer: "",
        productModel: "",
        productCondition: "new" as "new" | "used",
        productPrice: 0,
        productCurrency: "USD" as "USD" | "EUR" | "UAH",
        productCount: 0,
        productImages: [],
        productStatus: "available",
        productVideoUrl: "",
      });

      toast.success(t("toastSuccessAdd"));

      // Switch to myInquiries tab after successful submission
      if (onProductCreated) {
        onProductCreated();
      } else {
        // Fallback: use sessionStorage if callback not provided
        sessionStorage.setItem("accountTab", "myInquiries");
        router.push("/account");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error instanceof Error ? error.message : t("toastErrorAdd"));
    }
  };

  const clearDraft = () => {
    removeSavedFormData();

    form.reset({
      productName: "",
      productDescription: "",
      productCategory: "",
      productManufacturer: "",
      productModel: "",
      productCondition: "new" as "new" | "used",
      productPrice: 0,
      productCurrency: "USD" as "USD" | "EUR" | "UAH",
      productCount: 0,
      productImages: [],
      productStatus: "available",
    });

    toast.success(t("toastSuccessClear"));
  };
  return (
    <div className="w-full mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* Product Basic Info Form */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-background px-2 text-lg font-bold text-gray-700 max-w-[200px] truncate">
              {t("titleBasicInfo")}
            </h2>
            {/* Product name */}
            <FormFieldComponent
              control={form.control}
              name="productName"
              label={t("labelProductName")}
              type="input"
              placeholder={t("placeholderProductName")}
              className="w-full min-[600px]:w-1/2"
              classNameLabel="bg-background"
            />
            {/* Product SKU */}
            <FormFieldComponent
              control={form.control}
              name="productSku"
              label={t("labelSku")}
              type="input"
              placeholder={t("placeholderSku")}
              className="w-full min-[600px]:w-1/2"
              classNameLabel="bg-background"
            />
            {/* Product description */}
            <FormFieldComponent
              control={form.control}
              name="productDescription"
              label={t("labelDescription")}
              type="textarea"
              placeholder={t("placeholderDescription")}
              className="w-full md:w-1/2"
            />

            {/* Product category */}
            <FormField
              name="productCategory"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labelCategory")}</FormLabel>
                  <FormControl>
                    <CategoryCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      categories={categories}
                      loading={categoriesLoading}
                      error={categoriesError}
                      placeholder={t("placeholderCategory")}
                      className="w-full rounded-sm"
                    />
                  </FormControl>
                  {categoriesError && (
                    <p className="text-sm text-red-500 mt-1">
                      {t("errorCategories")}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col min-[600px]:flex-row w-full min-[600px]:gap-4 gap-6">
              {/* Product manufacturer */}
              <FormFieldComponent
                control={form.control}
                name="productManufacturer"
                label={t("labelManufacturer")}
                type="input"
                placeholder={t("placeholderManufacturer")}
                className="w-full"
                itemClassName="flex-1"
                classNameLabel="bg-background"
              />
              {/* Product model */}
              <FormFieldComponent
                control={form.control}
                name="productModel"
                label={t("labelModel")}
                type="input"
                placeholder={t("placeholderModel")}
                className="w-full"
                itemClassName="flex-1"
                classNameLabel="bg-background"
              />
            </div>

            {/* Product condition */}
            <FormFieldComponent
              control={form.control}
              name="productCondition"
              label={t("labelCondition")}
              type="select"
              placeholder={t("placeholderCondition")}
              className="w-full min-[600px]:w-1/2 rounded-sm"
              options={getProductConditionOptions(tCondition)}
              selectValue={undefined}
            />
          </div>

          {/* Product Pricing Form */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-background px-2 text-lg font-bold text-gray-700">
              {t("titlePrice")}
            </h2>
            {/* Product Prices */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <FormFieldComponent
                  control={form.control}
                  name="productPrice"
                  label={t("labelPrice") || "Price"}
                  type="input"
                  inputType="number"
                  className="flex-1"
                  classNameLabel="bg-background"
                  min="0.01"
                  step="0.01"
                  customOnChange={(e, fieldOnChange) => {
                    const value = e.target.value;
                    const numValue =
                      value === "" ? 0 : Math.max(0.01, Number(value));
                    fieldOnChange(numValue);
                  }}
                  customOnFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                />
                <FormFieldComponent
                  control={form.control}
                  name="productCurrency"
                  label={t("labelCurrency") || "Currency"}
                  type="select"
                  className="w-full sm:w-32"
                  classNameLabel="bg-background"
                  options={[
                    { key: "USD", label: "USD", value: "USD" },
                    { key: "EUR", label: "EUR", value: "EUR" },
                    { key: "UAH", label: "UAH", value: "UAH" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-background px-2 text-lg font-bold text-gray-700 max-w-[200px] truncate">
              {t("titleDetails")}
            </h2>
            {/* Product Count */}
            <FormFieldComponent
              control={form.control}
              name="productCount"
              label={t("labelCount")}
              type="input"
              inputType="number"
              className="w-full min-[600px]:w-1/2"
              classNameLabel="bg-background"
              min="1"
              step="1"
              customOnChange={(e, fieldOnChange) => {
                const value = e.target.value;
                const numValue = value === "" ? 0 : Math.max(1, Number(value));
                fieldOnChange(numValue);
              }}
              customOnFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
            />
            {/* Product Status */}
            <FormFieldComponent
              control={form.control}
              name="productStatus"
              label={t("labelStatus")}
              type="select"
              placeholder={t("placeholderStatus")}
              className="w-full min-[600px]:w-1/2 rounded-sm"
              options={getProductStatusOptions(tStatus)}
            />
          </div>

          {/* Product Video URL */}
          <div className="max-w-5xl mx-auto">
            <FormFieldComponent
              control={form.control}
              name="productVideoUrl"
              label={t("labelVideoUrl")}
              type="input"
              placeholder={
                t("placeholderVideoUrl") || "https://example.com/video"
              }
              className="w-full rounded-sm"
              classNameLabel="bg-background"
            />
          </div>

          {/* Images Dropzone */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-background px-2 text-lg font-bold text-gray-700">
              {t("titleImages")}
            </h2>
            <FormField
              control={form.control}
              name="productImages"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <ImagesDropzone
                        maxFiles={5}
                        maxSize={5 * 1024 * 1024}
                        enableCrop={true}
                        aspectRatio={16 / 9}
                        externalFiles={field.value || []}
                        onFilesChange={(files) => {
                          field.onChange(files || []);
                          console.log("Images updated in form:", files);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col min-[600px]:flex-row items-center justify-center gap-4">
            {savedFormData && (
              <Button
                type="button"
                variant="outline"
                onClick={clearDraft}
                className="w-full min-[600px]:w-auto px-4 py-2 min-[600px]:px-6 min-[600px]:py-2.5 text-base min-[600px]:text-lg font-medium"
              >
                {t("buttonClear")}
              </Button>
            )}

            <Button
              type="submit"
              disabled={createLoading}
              className="w-full rounded-sm text-white bg-gold-main min-[600px]:w-auto px-6 py-2 
              min-[600px]:px-8.5 min-[600px]:py-2.5 text-lg min-[600px]:text-xl font-medium
              hover:bg-gold-main/90"
            >
              {createLoading ? t("buttonCreating") : t("buttonSubmit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddProductForms;
