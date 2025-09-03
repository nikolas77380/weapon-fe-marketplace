import { Product } from "@/lib/types";
import React from "react";
import ProductImageGallery from "./ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import FavouriteButton from "@/components/ui/FavouriteButton";

const ProductDetail = ({ product }: { product: Product }) => {
  return (
    <div className="flex gap-9 w-full">
      {/* Images */}
      <div className="w-1/3">
        <ProductImageGallery
          images={product.images}
          productTitle={product.title}
        />
      </div>
      {/* Details */}
      <div className="w-2/3 flex flex-col">
        {/* Rating */}
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-[40px] font-medium">
            {product?.title || "Product"}
          </h1>
          <FavouriteButton productId={product.id} size="lg" />
        </div>

        <div className="flex items-center justify-between mt-5">
          {/* Price */}
          {product.price && (
            <span className="font-medium text-[25px]">${product?.price}</span>
          )}
          {/* Contact Seller */}
          <Button className="py-3 px-6 bg-black text-white rounded-md">
            Contact Seller
          </Button>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mt-7.5 border border-gray-primary p-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-15">
              <AvatarFallback className="uppercase text-3xl">
                {product?.seller?.username.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium text-xl">
                {product?.seller?.username || "User"}
              </p>
              <p className="text-sm">{product?.seller?.metadata?.country}UK</p>
            </div>
          </div>
          <Link
            href={`/profile/${product?.seller?.id}`}
            className="border border-gray-primary py-2.5 px-5"
          >
            <p>View profile</p>
          </Link>
        </div>
        {/* Tabs */}
        <div className="mt-7.5">
          <Tabs defaultValue="description">
            <TabsList className="bg-gray-primary w-full">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews(3)</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="text-lg font-light">
                {product?.description || "Not have description"}
              </p>
            </TabsContent>
            <TabsContent value="specifications">
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Model</h4>
                    <p className="text-lg">
                      {product?.attributesJson?.model || "Not have model name"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Category
                    </h4>
                    <p className="text-lg">
                      {product?.category?.name || "Not have category name"}
                    </p>
                  </div>
                </div>

                {/* Additional Attributes */}
                {product?.attributesJson && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Additional Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {product.attributesJson.condition && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Condition:
                          </span>
                          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {product.attributesJson.condition}
                          </span>
                        </div>
                      )}
                      {product.attributesJson.manufacturer && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Manufacturer:
                          </span>
                          <span className="ml-2 text-gray-800">
                            {product.attributesJson.manufacturer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Product Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">SKU:</span>
                      <span className="ml-2 text-gray-800">
                        {product?.sku || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          product?.status === "available"
                            ? "bg-green-100 text-green-800"
                            : product?.status === "reserved"
                            ? "bg-yellow-100 text-yellow-800"
                            : product?.status === "sold"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product?.status?.charAt(0).toUpperCase() +
                          product?.status?.slice(1) || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews"></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
