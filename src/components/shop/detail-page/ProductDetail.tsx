import { Product, SellerMeta } from "@/lib/types";
import React, { useState } from "react";
import ProductImageGallery from "./ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavouriteButton from "@/components/ui/FavouriteButton";
import { useSellerData } from "@/hooks/useSellerData";
import { formatPrice } from "@/lib/formatUtils";
import { useTranslations } from "next-intl";
import ContactModal from "../ContactModal";
import { useContactSeller } from "@/hooks/useContactSeller";
import { useAuthContext } from "@/context/AuthContext";

const ProductDetail = ({ product }: { product: Product }) => {
  const t = useTranslations("ProductDetail");
  const tContact = useTranslations("ShopCard");

  const { sellerData } = useSellerData(product?.seller?.id);
  const { contactSeller } = useContactSeller();
  const { currentUser } = useAuthContext();
  const [open, setOpen] = useState(false);
  const handleContactSeller = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (currentUser && product?.seller?.id) {
      const success = await contactSeller(product.seller.id, product.title);
      if (success) {
        return;
      }
    }
    setOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:flex-row lg:gap-9 mb-20 lg:mb-0 px-2 sm:px-4 lg:px-6">
      {/* Images */}
      <div className="w-full lg:w-1/3">
        <ProductImageGallery
          images={product.images}
          productTitle={product.title}
        />
      </div>
      {/* Details */}
      <div className="w-full lg:w-2/3 flex flex-col">
        {/* Rating */}
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-medium">
            {product?.title || t("titleProduct")}
          </h1>
          <FavouriteButton productId={product.id} size="lg" />
        </div>

        <div className="flex flex-col items-start min-[400px]:flex-row min-[400px]:items-center justify-between mt-4 lg:mt-5 gap-3">
          {/* Price */}
          {product.price && (
            <span className="font-medium text-xl sm:text-2xl lg:text-[25px]">
              {formatPrice(product.price, "$")}
            </span>
          )}
          {/* Contact Seller */}
          <Button
            onClick={(e) => handleContactSeller(e)}
            disabled={false}
            className="py-2 px-3 min-[400px]:px-4 sm:px-6 bg-gold-main text-white rounded-sm
            text-xs min-[400px]:text-sm sm:text-base hover:bg-gold-main/90 duration-300"
          >
            {tContact("titleCardSeller")}
          </Button>
        </div>

        {/* Seller Info */}
        <div
          className="flex flex-col items-start min-[400px]:flex-row min-[400px]:items-center
        justify-between mt-6 lg:mt-7.5 p-4 lg:p-5 gap-3"
        >
          <div className="flex items-center gap-3">
            <Avatar className="size-15">
              <AvatarImage
                src={sellerData?.metadata?.avatar?.url}
                alt={sellerData?.username || product?.seller?.username}
              />
              <AvatarFallback className="bg-black text-white text-sm uppercase">
                {sellerData?.username?.charAt(0) ||
                  product?.seller?.username?.charAt(0) ||
                  "?"}
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
                  <span className="text-gray-400">
                    {t("descriptionNotCountry")}
                  </span>
                )}
              </p>
            </div>
          </div>
          <Link
            href={`/company/${product?.seller?.id}`}
            className="border border-gray-primary w-full min-[400px]:w-auto py-2 px-3 sm:px-5 rounded-sm
            hover:bg-gold-main transition-all duration-300 flex items-center justify-center group"
          >
            <p className="text-xs min-[400px]:text-sm sm:text-base text-center group-hover:text-white duration-300">
              {t("titleViewProfile")}
            </p>
          </Link>
        </div>
        {/* Tabs */}
        <div className="mt-6 lg:mt-7.5">
          <Tabs defaultValue="description" className="w-full h-full">
            <TabsList className="bg-gray-100 flex flex-col min-[400px]:flex-row min-[400px]:w-auto w-full h-full rounded-sm">
              <TabsTrigger
                value="description"
                className="text-sm sm:text-base w-full min-[400px]:w-auto h-full py-2"
              >
                {t("titleTabDesc")}
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="text-sm sm:text-base w-full min-[400px]:w-auto h-full py-2"
              >
                {t("titleTabSpec")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="text-base sm:text-lg font-light">
                {product?.description || "Not have description"}
              </p>
            </TabsContent>
            <TabsContent value="specifications">
              <div className="space-y-4 sm:space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      {t("titleModel")}
                    </h4>
                    <p className="text-sm sm:text-base lg:text-lg">
                      {product?.attributesJson?.model || "Not have model name"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      {t("titleCategory")}
                    </h4>
                    <p className="text-sm sm:text-base lg:text-lg">
                      {product?.category?.name || t("titleNotCategory")}
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
                          {t("titleAddSpec")}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {attrs.condition && (
                            <div>
                              <span className="font-medium text-gray-600">
                                {t("titleCondition")}
                              </span>
                              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {attrs.condition}
                              </span>
                            </div>
                          )}
                          {attrs.manufacturer && (
                            <div>
                              <span className="font-medium text-gray-600">
                                {t("titleManufacturer")}
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
                    {t("titleProductDetails")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-sm sm:text-base">
                      <span className="font-medium text-gray-600">SKU:</span>
                      <span className="ml-2 text-gray-800">
                        {product?.sku || "Not specified"}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base">
                      <span className="font-medium text-gray-600">
                        {t("titleStatus")}
                      </span>
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
                          product?.status?.slice(1) || t("titleUnknown")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ContactModal
        open={open}
        onOpenChange={setOpen}
        sellerData={sellerData?.metadata as SellerMeta}
      />
    </div>
  );
};

export default ProductDetail;
