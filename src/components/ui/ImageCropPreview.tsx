"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { getCroppedImg, makeDefaultCrop } from "@/lib/cropUtils";
import { Check, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropPreviewProps {
  src: string;
  fileName: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel?: () => void;
  className?: string;
}

const ImageCropPreview: React.FC<ImageCropPreviewProps> = ({
  src,
  fileName,
  onCropComplete,
  onCancel,
  className = "",
}) => {
  const t = useTranslations("ImageCrop");
  const [crop, setCrop] = useState<Crop>(makeDefaultCrop());
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(() => {
    // Set default crop to entire image
    const defaultCrop = makeDefaultCrop();
    setCrop(defaultCrop);
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
          const croppedFile = await getCroppedImg(
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
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        fileName
      );
      onCropComplete(croppedFile);
    } catch (error) {
      console.error("Error creating cropped image:", error);
    }
  }, [completedCrop, fileName, onCropComplete]);

  const handleResetCrop = useCallback(() => {
    setCrop(makeDefaultCrop());
    setCompletedCrop(undefined);
  }, []);

  return (
    <div
      className={`space-y-1 min-[320px]:space-y-2 sm:space-y-3 ${className}`}
    >
      <div className="border rounded-lg overflow-hidden bg-gray-50 w-full min-w-0">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={undefined} // No fixed aspect ratio
          minWidth={20}
          minHeight={20}
          className="w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            alt="Crop preview"
            src={src}
            onLoad={onImageLoad}
            className="w-full max-w-full h-auto max-h-40 min-[320px]:max-h-48 sm:max-h-64 object-contain"
          />
        </ReactCrop>
      </div>

      <div className="flex flex-col min-[440px]:flex-row gap-1 min-[320px]:gap-2 justify-end">
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
