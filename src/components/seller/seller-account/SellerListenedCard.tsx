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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";

import Link from "next/link";
import { useProductActions } from "@/hooks/useProducts";
import { toast } from "sonner";

interface SellerListenedCardProps {
  product: Product;
  onProductDeleted?: () => void;
}

const SellerListenedCard = ({
  product,
  onProductDeleted,
}: SellerListenedCardProps) => {
  const { deleteProduct, loading } = useProductActions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
  return (
    <div className="border border-gray-primary rounded-xl px-8 py-6 flex justify-between w-full">
      {/* 1 */}
      <div className="flex gap-2.5">
        <Image
          src={"/gun.jpg"}
          alt={product.title}
          width={80}
          height={60}
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
          {product.status}
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

          <Ellipsis size={20} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default SellerListenedCard;
