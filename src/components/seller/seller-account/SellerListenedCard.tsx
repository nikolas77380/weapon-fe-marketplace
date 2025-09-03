import { Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Ellipsis, Eye, MessageSquare, SquarePen, Trash2 } from "lucide-react";
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
import { useProductActions } from "@/hooks/useProducts";
import { toast } from "sonner";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";

interface SellerListenedCardProps {
  product: Product;
  onProductDeleted?: () => void;
}

const SellerListenedCard = ({
  product,
  onProductDeleted,
}: SellerListenedCardProps) => {
  const { deleteProduct, updateProduct, loading } = useProductActions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(product.status);

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product.id);
      toast.success("Product successfully removed!");
      setIsDeleteDialogOpen(false);
      if (onProductDeleted) {
        onProductDeleted();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error removing product");
    }
  };

  const handleStatusUpdate = async (
    newStatus: "available" | "reserved" | "sold" | "archived"
  ) => {
    try {
      await updateProduct(product.id, { status: newStatus });
      setCurrentStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
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
    <div className="border border-gray-primary rounded-xl px-8 py-6 flex justify-between w-full">
      {/* 1 */}
      <div className="flex gap-2.5">
        <Image
          src={getBestImageUrl(product.images?.[0], "small") || "/shop/1.jpg"}
          alt={product.title}
          width={80}
          height={60}
          onError={(e) => handleImageError(e, "/shop/1.jpg")}
          className="rounded-md object-cover aspect-square"
        />
        <div className="flex flex-col">
          <h2 className="font-roboto text-xl">{product.title}</h2>
          <div className="flex items-center mt-1 gap-6 font-roboto font-extralight text-sm text-black">
            <p>{product.category?.name}</p>
            <p>{product.price}$</p>
            <p>Posted: {formatDate(product.createdAt)}</p>
          </div>
          <div className="mt-1 flex items-center gap-6 font-roboto font-medium text-sm text-gray-primary">
            <div className="flex items-center gap-1.5">
              <Eye size={18} />
              <p>15 views</p>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={18} />
              <p>10 Inquires</p>
            </div>
          </div>
        </div>
      </div>
      {/* 2 */}
      <div className="flex flex-col gap-8">
        <div className="bg-black text-white px-2.5 py-1 rounded-md text-sm font-medium self-start">
          {currentStatus}
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/account/edit-product/${product.slug}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SquarePen size={20} className="cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Product</p>
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
                      size={20}
                      className={`cursor-pointer text-red-500 ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-red-700"
                      }`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Product</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &ldquo;{product.title}&rdquo;?
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={loading}
                  className="py-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProduct}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <Ellipsis size={20} className="cursor-pointer" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleStatusUpdate("available")}
                className={`${
                  currentStatus === "available"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : ""
                }`}
              >
                Available
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate("reserved")}
                className={`${
                  currentStatus === "reserved"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : ""
                }`}
              >
                Reserved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate("sold")}
                className={`${
                  currentStatus === "sold"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : ""
                }`}
              >
                Sold
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate("archived")}
                className={`${
                  currentStatus === "archived"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : ""
                }`}
              >
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SellerListenedCard;
