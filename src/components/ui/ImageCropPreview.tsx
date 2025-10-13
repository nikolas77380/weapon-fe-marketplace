"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import {
  getCroppedImg,
  getCroppedImgCircular,
  // makeDefaultCrop,
} from "@/lib/cropUtils";
import { Check, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropPreviewProps {
  src: string;
  fileName: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel?: () => void;
  className?: string;
  cropShape?: "rect" | "circle";
}

const ImageCropPreview: React.FC<ImageCropPreviewProps> = ({
  src,
  fileName,
  onCropComplete,
  onCancel,
  className = "",
  cropShape = "rect",
}) => {
  const t = useTranslations("ImageCrop");
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 50,
    y: 50,
    width: 300,
    height: 300,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // const onImageLoad = useCallback(
  //   (e: React.SyntheticEvent<HTMLImageElement>) => {
  //     const img = e.target as HTMLImageElement;
  //     const containerWidth = 400;
  //     const containerHeight = 400;
  //     const maxSize = 300;
  //     const aspectRatio = img.naturalWidth / img.naturalHeight;

  //     let width = maxSize;
  //     let height = maxSize;

  //     if (aspectRatio > 1) {
  //       height = width / aspectRatio;
  //     } else {
  //       width = height * aspectRatio;
  //     }

  //     const x = (containerWidth - width) / 2;
  //     const y = (containerHeight - height) / 2;

  //     setCrop({
  //       unit: "px",
  //       x: Math.max(0, x),
  //       y: Math.max(0, y),
  //       width: Math.min(width, maxSize),
  //       height: Math.min(height, maxSize),
  //     });
  //   },
  //   []
  // );

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const containerWidth = 400;
    const containerHeight = 400;
    const maxSize = 300;
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    let width = maxSize;
    let height = maxSize;

    if (aspectRatio > 1) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }

    // Центрирование кропа в контейнере
    const x = (containerWidth - width) / 2;
    const y = (containerHeight - height) / 2;

    setCrop({
      unit: "px",
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(width, maxSize),
      height: Math.min(height, maxSize),
    });
  }, []);

  const handleApplyCrop = useCallback(async () => {
    if (
      !imgRef.current ||
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height
    ) {
      // If no crop is made, use the entire image
      const fullCrop = {
        unit: "px" as const,
        x: 0,
        y: 0,
        width: imgRef.current?.naturalWidth || 0,
        height: imgRef.current?.naturalHeight || 0,
      };

      if (imgRef.current) {
        try {
          const cropFunction =
            cropShape === "circle" ? getCroppedImgCircular : getCroppedImg;
          const croppedFile = await cropFunction(
            imgRef.current,
            fullCrop,
            fileName
          );
          onCropComplete(croppedFile);
        } catch (error) {
          console.error("Error creating cropped image:", error);
        }
      }
      return;
    }

    try {
      const cropFunction =
        cropShape === "circle" ? getCroppedImgCircular : getCroppedImg;
      const croppedFile = await cropFunction(
        imgRef.current,
        completedCrop,
        fileName
      );
      onCropComplete(croppedFile);
    } catch (error) {
      console.error("Error creating cropped image:", error);
    }
  }, [completedCrop, fileName, onCropComplete, cropShape]);

  const handleResetCrop = useCallback(() => {
    setCrop({ unit: "px", x: 50, y: 50, width: 300, height: 300 });
    setCompletedCrop(undefined);
  }, []);

  return (
    <div
      className={`space-y-1 min-[320px]:space-y-2 sm:space-y-3 w-full max-w-full overflow-visible ${className}`}
    >
      <div className="border rounded-lg overflow-hidden bg-gray-50 w-full max-w-[400px] mx-auto">
        <div
          className="relative w-[400px] h-[400px]"
          style={{ position: "relative" }}
        >
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={cropShape === "circle" ? 1 : undefined}
            minWidth={50}
            minHeight={50}
            className="w-full h-full"
            circularCrop={cropShape === "circle"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="Crop preview"
              src={src}
              onLoad={onImageLoad}
              className="w-full h-full object-contain aspect-square"
            />
          </ReactCrop>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end w-full">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetCrop}
          className="gap-1 w-full min-[440px]:w-auto text-xs sm:text-sm py-1 min-[320px]:py-2"
        >
          <RotateCcw className="h-3 w-3" />
          {t("buttonReset")}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="w-full min-[440px]:w-auto text-xs sm:text-sm py-1 min-[320px]:py-2"
          >
            {t("buttonCancel")}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={handleApplyCrop}
          className="gap-1 bg-gold-main hover:bg-gold-main/90 text-white w-full min-[440px]:w-auto text-xs sm:text-sm py-1 min-[320px]:py-2"
        >
          <Check className="h-3 w-3" />
          {t("buttonApply")}
        </Button>
      </div>
    </div>
  );
};

export default ImageCropPreview;
