import { ImageType, Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Ellipsis, Eye, SquarePen, Trash2 } from "lucide-react";
import { getDisplayPrice } from "@/lib/formatUtils";
import { useCurrency } from "@/hooks/useCurrency";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useProductActions } from "@/hooks/useProductsQuery";
import { toast } from "sonner";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { useLocale, useTranslations } from "next-intl";

interface SellerListenedCardProps {
  product: Product;
}

const SellerListenedCard = ({ product }: SellerListenedCardProps) => {
  const t = useTranslations("SellerAccountTabs.tabMyInquiries");
  const { selectedCurrency } = useCurrency();
  // const tCondition = useTranslations(
  //   "AddProduct.addProductForm.productCondition"
  // );
  const currentLocale = useLocale();

  const getCategoryDisplayName = (category: any) => {
    return currentLocale === "ua" && category?.translate_ua
      ? category.translate_ua
      : category?.name;
  };

  const tActivityStatus = useTranslations(
    "AddProduct.addProductForm.productActivityStatus"
  );
  const { deleteProduct, updateProduct, loading } = useProductActions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentActivityStatus, setCurrentActivityStatus] = useState(
    product.activityStatus || "active"
  );

  const getActivityStatusStyles = (activityStatus: string) => {
    switch (activityStatus) {
      case "active":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTranslatedActivityStatus = (activityStatus: string) => {
    switch (activityStatus) {
      case "active":
        return tActivityStatus("active");
      case "archived":
        return tActivityStatus("archived");
      default:
        return activityStatus;
    }
  };

  const getTranslatedActivityStatusOptions = () => {
    return [
      { value: "active", label: getTranslatedActivityStatus("active") },
      { value: "archived", label: getTranslatedActivityStatus("archived") },
    ];
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct({ id: product.id });
      toast.success("Product successfully removed!");
      setIsDeleteDialogOpen(false);
      // TanStack Query will automatically refetch the data
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error removing product");
    }
  };

  const handleActivityStatusUpdate = async (
    newActivityStatus: "active" | "archived"
  ) => {
    try {
      await updateProduct({
        id: product.id.toString(),
        data: { activityStatus: newActivityStatus },
      });
      setCurrentActivityStatus(newActivityStatus);
      // TanStack Query will automatically refetch the data and update the UI
    } catch (error) {}
  };

  // Update the local activity status when changing activity status
  useEffect(() => {
    setCurrentActivityStatus(product.activityStatus || "active");
  }, [product.activityStatus]);
  return (
    <div
      className="border border-gray-primary px-4 sm:px-8 py-4 sm:py-6 flex flex-col min-[600px]:flex-row 
    justify-between w-full bg-background gap-4 rounded-sm"
    >
      {/* Product info */}
      <div className="flex gap-2.5 items-start">
        <Image
          src={
            getBestImageUrl(product.images?.[0] as ImageType, "small") ||
            "/shop/1.jpg"
          }
          alt={product.title}
          width={80}
          height={60}
          onError={(e) => handleImageError(e, "/shop/1.jpg")}
          className="rounded-md object-contain aspect-square"
        />
        <div className="flex flex-col">
          <h2 className="font-roboto text-lg sm:text-xl">{product.title}</h2>
          <div className="flex flex-wrap items-center mt-1 gap-3 sm:gap-6 font-extralight text-sm text-black">
            <p className="truncate max-w-[200px] sm:max-w-[260px]">
              {getCategoryDisplayName(product.category)}
            </p>
            <p>{getDisplayPrice(product, selectedCurrency)}</p>
            <p>
              {formatDate(product.createdAt, currentLocale, {
                justNow: t("dateFormat.justNow"),
                minutesAgo: (count) => t("dateFormat.minutesAgo", { count }),
                hoursAgo: (count) => t("dateFormat.hoursAgo", { count }),
                daysAgo: (count) => t("dateFormat.daysAgo", { count }),
                invalidDate: t("dateFormat.invalidDate"),
              })}
            </p>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 sm:gap-6 font-roboto font-medium text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="min-[400px]:size-[18px]" />
              <p>
                {t("titleViews", {
                  count: product.viewsCount || 0,
                })}
              </p>
            </div>
            {/* <div className="flex items-center gap-1.5">
              <MessageSquare size={18} />
              <p>10 Inquires</p>
            </div> */}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex min-[600px]:flex-col items-center min-[600px]:items-start justify-between min-[600px]:justify-end gap-4 min-[600px]:gap-8">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/marketplace/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preview"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Eye size={16} className="cursor-pointer min-[400px]:size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("titlePreview")}</p>
            </TooltipContent>
          </Tooltip>
          <Link href={`/account/edit-product/${product.slug}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SquarePen
                  size={16}
                  className="cursor-pointer min-[400px]:size-5"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("titleToogleEditProduct")}</p>
              </TooltipContent>
            </Tooltip>
          </Link>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2
                      size={16}
                      className={`cursor-pointer text-red-500 min-[400px]:size-5 ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-red-700"
                      }`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("titleToogleDeleteCard")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </DialogTrigger>
            <DialogContent className="rounded-lg border-gold-main">
              <DialogHeader>
                <DialogTitle>{t("titleToogleDeleteCard")}</DialogTitle>
                <DialogDescription>
                  {t("descriptionModalDeleteProduct1")} &ldquo;
                  {product.title}&rdquo;? {t("descriptionModalDeleteProduct2")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={loading}
                  className="py-2 border-gold-main"
                >
                  {t("descriptionModalCancel")}
                </Button>
                <Button
                  variant="default"
                  onClick={handleDeleteProduct}
                  disabled={loading}
                  className="py-2 bg-gold-main hover:bg-gold-main/80 text-white"
                >
                  {loading
                    ? t("descriptionModalDeleting")
                    : t("titleToogleDeleteCard")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <Ellipsis
                  size={16}
                  className="cursor-pointer min-[400px]:size-5"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {getTranslatedActivityStatusOptions()
                .filter(
                  (activityStatus) =>
                    activityStatus.value !== currentActivityStatus
                )
                .map((activityStatus) => (
                  <DropdownMenuItem
                    key={activityStatus.value}
                    onClick={() =>
                      handleActivityStatusUpdate(
                        activityStatus.value as "active" | "archived"
                      )
                    }
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    {activityStatus.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className={`px-2 py-0.5 text-xs font-medium self-start rounded ${getActivityStatusStyles(
            currentActivityStatus
          )}`}
        >
          {getTranslatedActivityStatus(currentActivityStatus)}
        </div>
      </div>
    </div>
  );
};

export default SellerListenedCard;
