"use client";

import React, { useEffect } from "react";
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
  addProductSchema,
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
import CategorySelect from "@/components/ui/CategorySelect";
import { useProductActions } from "@/hooks/useProductsQuery";
import { useTranslations } from "next-intl";

const AddProductForms = () => {
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
    getMainCategories,
    getSubCategories,
  } = useCategories();

  const {
    createProduct,
    loading: createLoading,
    error: createError,
  } = useProductActions();

  const router = useRouter();

  const form = useForm<AddProductSchemaValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      productName: "",
      productSku: "",
      productDescription: "",
      productCategory: "",
      productManufacturer: "",
      productModel: "",
      productCondition: "",
      productPriceUSD: 0,
      productPriceEUR: 0,
      productPriceUAH: 0,
      productCount: 0,
      productImages: undefined,
      productStatus: "available",
    },
  });

  useEffect(() => {
    if (savedFormData) {
      form.reset(savedFormData);
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
        priceUSD: values.productPriceUSD,
        priceEUR: values.productPriceEUR,
        priceUAH: values.productPriceUAH,
        category: selectedCategory.id,
        sku: values.productSku || undefined,
        status: values.productStatus,
        attributesJson: {
          manufacturer: values.productManufacturer,
          model: values.productModel,
          condition: values.productCondition,
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
        productCondition: "",
        productPriceUSD: 0,
        productPriceEUR: 0,
        productPriceUAH: 0,
        productCount: 0,
        productStatus: "available",
      });

      toast.success(t("toastSuccessAdd"));
      router.push("/account");
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
      productCondition: "",
      productPriceUSD: 0,
      productPriceEUR: 0,
      productPriceUAH: 0,
      productCount: 0,
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
                    <CategorySelect
                      key={`category-select-${field.value}`}
                      value={field.value}
                      onValueChange={field.onChange}
                      categories={categories}
                      loading={categoriesLoading}
                      error={categoriesError}
                      placeholder={t("placeholderCategory")}
                      className="w-full min-[600px]:w-1/2 rounded-sm"
                      getMainCategories={getMainCategories}
                      getSubCategories={getSubCategories}
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
              <FormFieldComponent
                control={form.control}
                name="productPriceUSD"
                label="Price (USD)"
                type="input"
                inputType="number"
                className="w-full sm:w-1/3"
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
                name="productPriceEUR"
                label="Price (EUR)"
                type="input"
                inputType="number"
                className="w-full sm:w-1/3"
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
                name="productPriceUAH"
                label="Price (UAH)"
                type="input"
                inputType="number"
                className="w-full sm:w-1/3"
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

          {/* Images Dropzone */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-background px-2 text-lg font-bold text-gray-700">
              {t("titleImages")}
            </h2>
            <FormField
              control={form.control}
              name="productImages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImagesDropzone
                      maxFiles={5}
                      maxSize={5 * 1024 * 1024}
                      enableCrop={true}
                      aspectRatio={16 / 9}
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
              disabled={createLoading || !form.formState.isValid}
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
