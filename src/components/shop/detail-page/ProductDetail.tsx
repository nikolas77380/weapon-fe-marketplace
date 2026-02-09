import { Product } from "@/lib/types";
import React, { useState, useMemo } from "react";
import ProductImageGallery from "./ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavouriteButton from "@/components/ui/FavouriteButton";
import { getDisplayPrice } from "@/lib/formatUtils";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { getProductTitle, getProductDescription } from "@/lib/product-i18n";
import ContactModal from "../ContactModal";
import { useCurrency } from "@/hooks/useCurrency";
import { getVideoEmbedUrl } from "@/lib/videoUtils";
import { COUNTRIES } from "@/lib/utils";

const ProductDetail = ({ product }: { product: Product }) => {
  const t = useTranslations("ProductDetail");
  const tContact = useTranslations("ShopCard");
  const tStatus = useTranslations("AddProduct.addProductForm.productStatus");
  const tCondition = useTranslations(
    "AddProduct.addProductForm.productCondition"
  );
  const currentLocale = useLocale() as "ua" | "en";
  const { selectedCurrency } = useCurrency();
  const productTitle = getProductTitle(product, currentLocale);
  const productDescription = getProductDescription(product, currentLocale);

  const [open, setOpen] = useState(false);

  // Получаем embed URL для видео
  const videoEmbedUrl = useMemo(() => {
    if (!product?.videoUrl) return null;
    return getVideoEmbedUrl(product.videoUrl);
  }, [product?.videoUrl]);

  const getCategoryDisplayName = (category: any) => {
    return currentLocale === "ua" && category?.translate_ua
      ? category.translate_ua
      : category?.name;
  };

  const getTranslatedCondition = (condition: string) => {
    switch (condition) {
      case "new":
        return tCondition("new");
      case "used":
        return tCondition("used");
      default:
        return condition;
    }
  };

  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case "available":
        return tStatus("available");
      case "unavailable":
        return tStatus("unavailable");
      default:
        return (
          status?.charAt(0).toUpperCase() + status?.slice(1) ||
          t("titleUnknown")
        );
    }
  };

  const handleContactSeller = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:flex-row lg:gap-9 mb-20 lg:mb-0 px-2 sm:px-4 lg:px-6">
      {/* Images */}
      <div className="w-full lg:w-1/3">
        <ProductImageGallery
          images={product.images}
          productTitle={productTitle}
        />
      </div>
      {/* Details */}
      <div className="w-full lg:w-2/3 flex flex-col">
        {/* Rating */}
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-medium">
            {productTitle || t("titleProduct")}
          </h1>
          <FavouriteButton productId={product.id} size="lg" />
        </div>

        <div className="flex flex-col items-start min-[400px]:flex-row min-[400px]:items-center justify-between mt-4 lg:mt-5 gap-3">
          {/* Price */}
          {(product.priceUSD ||
            product.priceEUR ||
            product.priceUAH ||
            product.price) && (
            <span className="font-medium text-xl sm:text-2xl lg:text-[25px]">
              {getDisplayPrice(product, selectedCurrency)}
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
                src={product?.seller?.avatarUrl || ""}
                alt={product?.seller?.username || ""}
              />
              <AvatarFallback className="bg-black text-white text-sm uppercase">
                {product?.seller?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {/* Company name */}
              {product?.seller?.companyName && (
                <p className="text-sm text-gray-600">
                  {product?.seller?.companyName}
                </p>
              )}
              {/* Country */}
              <p className="text-sm">
                {COUNTRIES.find(
                  (country) => country.iso2 === product?.seller?.country
                )?.name
                  ? currentLocale === "ua"
                    ? COUNTRIES.find(
                        (country) => country.iso2 === product?.seller?.country
                      )?.ua
                    : COUNTRIES.find(
                        (country) => country.iso2 === product?.seller?.country
                      )?.name
                  : currentLocale === "ua"
                  ? COUNTRIES.find(
                      (country) => country.name === product?.seller?.country
                    )?.ua
                  : COUNTRIES.find(
                      (country) => country.name === product?.seller?.country
                    )?.name}
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
                {productDescription ?? ""}
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
                      {product?.attributesJson?.model || ""}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      {t("titleCategory")}
                    </h4>
                    <p className="text-sm sm:text-base lg:text-lg">
                      {getCategoryDisplayName(product?.category) ||
                        t("titleNotCategory")}
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
                          {product?.condition && (
                            <div>
                              <span className="font-medium text-gray-600">
                                {t("titleCondition")}
                              </span>
                              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {getTranslatedCondition(product.condition)}
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
                      <span className="font-medium text-gray-600">
                        {t("titleSKU")}
                      </span>
                      <span className="ml-2 text-gray-800">
                        {product?.sku || t("notSpecified")}
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
                            : product?.status === "unavailable"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getTranslatedStatus(product?.status || "")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {videoEmbedUrl && (
          <div className="mt-6 lg:mt-7.5 mb-10">
            <h3 className="text-lg font-semibold mb-2">
              {t("titleVideo") || "Video"}
            </h3>
            <div className="aspect-video w-full rounded-sm overflow-hidden">
              <iframe
                src={videoEmbedUrl}
                title={productTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}
        {open && product?.seller?.id && (
          <ContactModal
            open={open}
            onOpenChange={setOpen}
            sellerId={product?.seller?.id}
            productId={product?.id}
            productTitle={productTitle}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
