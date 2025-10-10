import { ImageType, Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Ellipsis, Eye, SquarePen, Trash2 } from "lucide-react";
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
import { updateStatus } from "@/mockup/status";
import { useTranslations } from "next-intl";

interface SellerListenedCardProps {
  product: Product;
}

const SellerListenedCard = ({ product }: SellerListenedCardProps) => {
  const t = useTranslations("SellerAccountTabs");

  const { deleteProduct, updateProduct, loading } = useProductActions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(product.status);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-600 text-white";
      case "reserved":
        return "bg-yellow-500 text-black";
      case "sold":
        return "bg-red-600 text-white";
      case "archived":
        return "bg-gray-500 text-white";
      default:
        return "bg-black text-white";
    }
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

  const handleStatusUpdate = async (
    newStatus: "available" | "reserved" | "sold" | "archived"
  ) => {
    try {
      await updateProduct({ id: product.id, data: { status: newStatus } });
      setCurrentStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
      // TanStack Query will automatically refetch the data and update the UI
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Update the local status when changing status
  useEffect(() => {
    setCurrentStatus(product.status);
  }, [product.status]);
  return (
    <div className="border border-gray-primary px-4 sm:px-8 py-4 sm:py-6 flex flex-col min-[600px]:flex-row justify-between w-full bg-background gap-4">
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
          className="rounded-md object-cover aspect-square"
        />
        <div className="flex flex-col">
          <h2 className="font-roboto text-lg sm:text-xl">{product.title}</h2>
          <div className="flex flex-wrap items-center mt-1 gap-3 sm:gap-6 font-roboto font-extralight text-sm text-black">
            <p>{product.category?.name}</p>
            <p>{product.price}$</p>
            <p>Posted: {formatDate(product.createdAt)}</p>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 sm:gap-6 font-roboto font-medium text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="min-[400px]:size-[18px]" />
              <p>
                {t("tabMyInquiries.titleViews", {
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
      <div className="flex items-center min-[600px]:items-start justify-between min-[600px]:justify-end gap-4 min-[600px]:gap-8">
        <div
          className={`px-2 py-0.5 text-xs font-medium self-start rounded ${getStatusStyles(
            currentStatus
          )}`}
        >
          {currentStatus}
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/account/edit-product/${product.slug}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SquarePen
                  size={16}
                  className="cursor-pointer min-[400px]:size-5"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("tabMyInquiries.titleToogleEditProduct")}</p>
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
                    <p>{t("tabMyInquiries.titleToogleDeleteCard")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("tabMyInquiries.titleToogleDeleteCard")}
                </DialogTitle>
                <DialogDescription>
                  {t("tabMyInquiries.descriptionModalDeleteProduct1")} &ldquo;
                  {product.title}&rdquo;?{" "}
                  {t("tabMyInquiries.descriptionModalDeleteProduct2")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={loading}
                  className="py-2"
                >
                  {t("tabMyInquiries.descriptionModalCancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProduct}
                  disabled={loading}
                >
                  {loading
                    ? t("tabMyInquiries.descriptionModalDeleting")
                    : t("tabMyInquiries.titleToogleDeleteCard")}
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
              {updateStatus
                .filter((status) => status.value !== currentStatus)
                .map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() =>
                      handleStatusUpdate(
                        status.value as
                          | "available"
                          | "reserved"
                          | "sold"
                          | "archived"
                      )
                    }
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    {status.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SellerListenedCard;
