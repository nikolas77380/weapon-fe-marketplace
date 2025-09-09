import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FieldType = "input" | "textarea" | "select" | "checkbox";

interface SelectOption {
  readonly key: string;
  readonly label: string;
  readonly value?: string;
}

interface FormFieldComponentProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string | React.ReactNode;
  type?: FieldType;
  placeholder?: string;
  className?: string;
  itemClassName?: string;
  inputType?: string;
  rows?: number;
  min?: string | number;
  step?: string | number;
  autoComplete?: string;
  options?: readonly SelectOption[];
  selectValue?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  customSelectOptions?: React.ReactNode;
  customOnChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: unknown) => void
  ) => void;
  customOnFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function FormFieldComponent<T extends FieldValues>({
  control,
  name,
  label,
  type = "input",
  placeholder,
  className,
  itemClassName,
  inputType = "text",
  rows,
  min,
  step,
  autoComplete,
  options = [],
  selectValue,
  onValueChange,
  defaultValue,
  customOnChange,
  customOnFocus,
  customSelectOptions,
}: FormFieldComponentProps<T>) {
  const renderField = (field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
  }) => {
    switch (type) {
      case "input":
        return (
          <div className="relative">
            <label className="absolute bg-primary-foreground px-2 left-2 -top-3 text-sm">
              {label}
            </label>
            <Input
              type={inputType}
              placeholder={placeholder}
              className={className}
              min={min}
              step={step}
              autoComplete={autoComplete}
              {...field}
              value={String(field.value || "")}
              onChange={
                customOnChange
                  ? (e) => customOnChange(e, field.onChange)
                  : field.onChange
              }
              onFocus={customOnFocus}
            />
          </div>
        );

      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            className={className}
            rows={rows}
            {...field}
            value={String(field.value || "")}
          />
        );

      case "select":
        return (
          <Select
            onValueChange={onValueChange || field.onChange}
            value={selectValue || String(field.value || "")}
            defaultValue={defaultValue}
          >
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {customSelectOptions ||
                options.map(({ key, label, value }) => (
                  <SelectItem key={key} value={value || key}>
                    {label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={String(name)}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              className={className}
            />
            <label
              htmlFor={String(name)}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {typeof label === "string" ? label : label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          {type !== "checkbox" && type !== "input" && (
            <FormLabel>{label}</FormLabel>
          )}
          <FormControl>{renderField(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormFieldComponent;
