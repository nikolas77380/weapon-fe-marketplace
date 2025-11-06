import React, { useState } from "react";
import Image from "next/image";
import { getBestImageUrl, handleImageError } from "@/lib/imageUtils";
import { ImageType, MediaFile } from "@/lib/types";

interface ProductImageGalleryProps {
  images?: MediaFile[];
  productTitle: string;
}

const ProductImageGallery = ({
  images,
  productTitle,
}: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleImageClick = (index: number) => {
    if (images && images.length > 0 && index !== selectedImageIndex) {
      setIsImageLoading(true);
      setSelectedImageIndex(index);

      setTimeout(() => {
        setIsImageLoading(false);
      }, 3000);
    }
  };

  const selectedImage = images?.[selectedImageIndex] || images?.[0];
  const hasImages = images && images.length > 0;

  const handleImageLoad = () => {
    setIsImageLoading(false);
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main large image */}
      <div className="relative w-full h-126 rounded-lg overflow-hidden">
        {/* Loading overlay */}
        {isImageLoading && !isInitialLoad && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
              {/* Loading text */}
              <p className="text-white text-sm font-medium">Loading image...</p>
            </div>
          </div>
        )}

        {selectedImage ? (
          <Image
            src={
              getBestImageUrl(selectedImage as ImageType, "large") ||
              "/shop/1.jpg"
            }
            alt={selectedImage.name || productTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            priority={selectedImageIndex === 0}
            className="object-contain aspect-square"
            onLoad={handleImageLoad}
            onError={(e) => handleImageError(e, "/shop/1.jpg")}
          />
        ) : (
          <Image
            src="/shop/1.jpg"
            alt="No image available"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            priority
            className="object-cover"
            onLoad={handleImageLoad}
          />
        )}
      </div>

      {/* Thumbnail images */}
      {hasImages ? (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative w-20 h-20 rounded-sm overflow-hidden cursor-pointer border transition-all duration-200 ${
                index === selectedImageIndex && !isImageLoading
                  ? "border-gold-main/10 scale-105 shadow-lg"
                  : "border-transparent hover:scale-102"
              }`}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={
                  getBestImageUrl(image as ImageType, "thumbnail") ||
                  "/shop/1.jpg"
                }
                alt={image.name || productTitle}
                fill
                sizes="80px"
                loading="lazy"
                className="object-contain aspect-square p-1"
                onError={(e) => handleImageError(e, "/shop/1.jpg")}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
            <Image
              src="/shop/1.jpg"
              alt="No image available"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
