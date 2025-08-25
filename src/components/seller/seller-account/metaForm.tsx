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
import { COUNTRIES, SELLER_TYPES } from "@/lib/utils";

interface SellerFormProps {
  onSubmit: (values: SellerFormValues) => void;
  isLoading?: boolean;
}

const MetaForm = ({ onSubmit, isLoading = false }: SellerFormProps) => {
  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      specialisation: "",
      sellerDescription: "",
      companyName: "",
      webSite: "",
      phoneNumbers: "",
      country: "UA",
      address: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            {isLoading ? "Saving..." : "Submit Company Details"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MetaForm;
