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
  PRODUCT_CONDITION_FORM,
  PRODUCT_STATUS_FORM,
  STORAGE_KEY,
} from "@/lib/utils";
import { toast } from "sonner";
import ImagesDropzone from "@/components/ui/ImagesDropzone";
import { useCategories } from "@/hooks/useCategories";
import CategorySelect from "@/components/ui/CategorySelect";
import { useProductActions } from "@/hooks/useProductsQuery";

const AddProductForms = () => {
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
      productPrice: 0,
      productCount: 0,
      productCurrency: "USD",
      productImages: undefined,
      productStatus: "available",
    },
  });

  // Recovering data from localStorage when loading
  useEffect(() => {
    if (savedFormData) {
      form.reset(savedFormData);
    }
  }, [savedFormData, form]);

  // Очищаем localStorage при загрузке страницы, если пользователь пришел сюда заново
  useEffect(() => {
    // Если есть данные в localStorage, но форма пустая, значит пользователь пришел заново
    if (savedFormData && !form.getValues("productName")) {
      removeSavedFormData();
    }
  }, [form, removeSavedFormData, savedFormData]);

  // Autosave when changing form
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
        (cat) => cat.name === values.productCategory
      );

      if (!selectedCategory) {
        toast.error("Please select a valid category");
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
        attributesJson: {
          manufacturer: values.productManufacturer,
          model: values.productModel,
          condition: values.productCondition,
          count: values.productCount,
        },
      };

      await createProduct({ data: productData, images: values.productImages });

      // Очищаем localStorage и сбрасываем форму
      removeSavedFormData();

      // Сбрасываем форму к начальным значениям
      form.reset({
        productName: "",
        productDescription: "",
        productCategory: "",
        productManufacturer: "",
        productModel: "",
        productCondition: "",
        productPrice: 0,
        productCount: 0,
        productCurrency: "USD",
        productStatus: "available",
      });

      toast.success("Product added successfully!");
      router.push("/account");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
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
      productPrice: 0,
      productCount: 0,
      productCurrency: "USD",
      productStatus: "available",
    });

    toast.success("Draft cleared successfully!");
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* Product Basic Info Form */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-white px-2 text-lg font-bold text-gray-700">
              Basic Info
            </h2>
            {/* Product name */}
            <FormFieldComponent
              control={form.control}
              name="productName"
              label="Product Name"
              type="input"
              placeholder="Enter your product name"
              className="w-1/2"
            />
            {/* Product SKU */}
            <FormFieldComponent
              control={form.control}
              name="productSku"
              label="Product SKU (Optional)"
              type="input"
              placeholder="Enter your product SKU (optional)"
              className="w-1/2"
            />
            {/* Product description */}
            <FormFieldComponent
              control={form.control}
              name="productDescription"
              label="Description"
              type="textarea"
              placeholder="Enter product description"
              className="w-1/2"
            />

            {/* Product category */}
            <FormField
              name="productCategory"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      categories={categories}
                      loading={categoriesLoading}
                      error={categoriesError}
                      placeholder="Select Category"
                      className="w-1/2"
                    />
                  </FormControl>
                  {categoriesError && (
                    <p className="text-sm text-red-500 mt-1">
                      Failed to load categories. Please try again later.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full gap-4">
              {/* Product manufacturer */}
              <FormFieldComponent
                control={form.control}
                name="productManufacturer"
                label="Manufacturer"
                type="input"
                placeholder="Enter your product manufacturer"
                className="w-full"
                itemClassName="flex-1"
              />
              {/* Product model */}
              <FormFieldComponent
                control={form.control}
                name="productModel"
                label="Model"
                type="input"
                placeholder="Enter your product model"
                className="w-full"
                itemClassName="flex-1"
              />
            </div>

            {/* Product condition */}
            <FormFieldComponent
              control={form.control}
              name="productCondition"
              label="Condition"
              type="select"
              placeholder="Select Condition"
              className="w-1/2"
              options={PRODUCT_CONDITION_FORM}
              selectValue={undefined}
            />
          </div>

          {/* Product Pricing Form */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-white px-2 text-lg font-bold text-gray-700">
              Pricing
            </h2>
            {/* Product Price */}
            <FormFieldComponent
              control={form.control}
              name="productPrice"
              label="Price (USD)"
              type="input"
              inputType="number"
              className="w-1/2"
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
          </div>

          {/* Product Details */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-white px-2 text-lg font-bold text-gray-700">
              Details
            </h2>
            {/* Product Count */}
            <FormFieldComponent
              control={form.control}
              name="productCount"
              label="Count"
              type="input"
              inputType="number"
              className="w-1/2"
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
              label="Status"
              type="select"
              placeholder="Select Status"
              className="w-1/2"
              options={PRODUCT_STATUS_FORM}
            />
          </div>

          {/* Images Dropzone */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-white px-2 text-lg font-bold text-gray-700">
              Images
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
          <div className="flex items-center justify-center gap-4">
            {savedFormData && (
              <Button
                type="button"
                variant="outline"
                onClick={clearDraft}
                className="px-6 py-2.5 text-lg font-roboto font-medium"
              >
                Clear Draft
              </Button>
            )}
            <Button
              type="submit"
              disabled={createLoading}
              className="px-8.5 py-2.5 text-xl font-roboto font-medium"
            >
              {createLoading ? "Creating..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddProductForms;
