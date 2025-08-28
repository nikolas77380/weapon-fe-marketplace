"use client";

import React, { useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  addProductSchema,
  AddProductSchemaValues,
} from "@/schemas/addProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CONDITION_FORM, STORAGE_KEY } from "@/lib/utils";
import { toast } from "sonner";
import ImagesDropzone from "@/components/ui/ImagesDropzone";
import { useCategories } from "@/hooks/useCategories";
import CategorySelect from "@/components/ui/CategorySelect";
import { useProductActions } from "@/hooks/useProducts";

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
      productImages: undefined,
    },
  });

  // Recovering data from localStorage when loading
  useEffect(() => {
    if (savedFormData) {
      form.reset(savedFormData);
    }
  }, [savedFormData, form]);

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
      toast.error(createError);
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
        currency: "USD",
        category: selectedCategory.id,
        sku: values.productSku || undefined,
        status: "available" as const,
        attributesJson: {
          manufacturer: values.productManufacturer,
          model: values.productModel,
          condition: values.productCondition,
          count: values.productCount,
        },
      };

      const createdProduct = await createProduct(productData);

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
      });

      toast.success("Product added successfully!");
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
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your product name"
                      className="w-1/2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Product SKU */}
            <FormField
              control={form.control}
              name="productSku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product SKU</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your product SKU"
                      className="w-1/2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Product description */}
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="w-1/2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              <FormField
                control={form.control}
                name="productManufacturer"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your product manufacturer"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Product model */}
              <FormField
                control={form.control}
                name="productModel"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your product model"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product condition */}
            <FormField
              name="productCondition"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Select Condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_CONDITION_FORM.map(({ key, label }) => (
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
          </div>

          {/* Product Pricing Form */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-white px-2 text-lg font-bold text-gray-700">
              Pricing
            </h2>
            {/* Product Price */}
            <FormField
              control={form.control}
              name="productPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-1/2"
                      min="1"
                      step="1"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue =
                          value === "" ? 0 : Math.max(1, Number(value));
                        field.onChange(numValue);
                      }}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Product Details */}
          <div className="relative border border-gray-primary rounded-2xl p-10 space-y-6 flex flex-col max-w-5xl mx-auto">
            <h2 className="absolute -top-3.5 left-9 bg-white px-2 text-lg font-bold text-gray-700">
              Details
            </h2>
            {/* Product Price */}
            <FormField
              control={form.control}
              name="productCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-1/2"
                      min="1"
                      step="1"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue =
                          value === "" ? 0 : Math.max(1, Number(value));
                        field.onChange(numValue);
                      }}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
