import { Product } from "@/lib/types";
import React from "react";
import ProductImageGallery from "./ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavouriteButton from "@/components/ui/FavouriteButton";
import { useSellerData } from "@/hooks/useSellerData";
import { formatPrice } from "@/lib/formatUtils";
import { useTranslations } from "next-intl";

const ProductDetail = ({ product }: { product: Product }) => {
  const t = useTranslations('ProductDetail');

  const { sellerData } = useSellerData(product?.seller?.id);

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
            {product?.title || t('titleProduct')}
          </h1>
          <FavouriteButton productId={product.id} size="lg" />
        </div>

        <div className="flex items-center justify-between mt-5">
          {/* Price */}
          {product.price && (
            <span className="font-medium text-[25px]">
              {formatPrice(product.price, "$")}
            </span>
          )}
          {/* Contact Seller */}
          <Button className="py-3 px-6 bg-black text-white rounded-md">
            {t('titleCardSeller')}
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
              {/* Company name */}
              {sellerData?.metadata?.companyName && (
                <p className="text-sm text-gray-600">
                  {sellerData.metadata.companyName}
                </p>
              )}
              {/* Country */}
              <p className="text-sm">
                {sellerData?.metadata?.country ? (
                  sellerData.metadata.country
                ) : (
                  <span className="text-gray-400">{t('descriptionNotCountry')}</span>
                )}
              </p>
            </div>
          </div>
          <Link
            href={`/company/${product?.seller?.id}`}
            className="border border-gray-primary py-2.5 px-5"
          >
            <p>{t('titleViewProfile')}</p>
          </Link>
        </div>
        {/* Tabs */}
        <div className="mt-7.5">
          <Tabs defaultValue="description">
            <TabsList className="bg-gray-primary w-full">
              <TabsTrigger value="description">{t('titleTabDesc')}</TabsTrigger>
              <TabsTrigger value="specifications">{t('titleTabSpec')}</TabsTrigger>
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
                    <h4 className="font-semibold text-gray-700 mb-2">{t('titleModel')}</h4>
                    <p className="text-lg">
                      {product?.attributesJson?.model || "Not have model name"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      {t('titleCategory')}
                    </h4>
                    <p className="text-lg">
                      {product?.category?.name || t('titleNotCategory')}
                    </p>
                  </div>
                </div>

                {/* Additional Attributes */}
                {(() => {
                  const attrs = product?.attributesJson || null;
                  return (
                    attrs && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          {t('titleAddSpec')}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {attrs.condition && (
                            <div>
                              <span className="font-medium text-gray-600">
                                {t('titleCondition')}
                              </span>
                              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {attrs.condition}
                              </span>
                            </div>
                          )}
                          {attrs.manufacturer && (
                            <div>
                              <span className="font-medium text-gray-600">
                                {t('titleManufacturer')}
                              </span>
                              <span className="ml-2 text-gray-800">
                                {attrs.manufacturer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  );
                })()}

                {/* Product Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    {t('titleProductDetails')}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">SKU:</span>
                      <span className="ml-2 text-gray-800">
                        {product?.sku || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">{t('titleStatus')}</span>
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
                          product?.status?.slice(1) || t('titleUnknown')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
