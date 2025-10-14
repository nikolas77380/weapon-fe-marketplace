"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface ImageCropPreviewProps {
  src: string;
  fileName: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel?: () => void;
  className?: string;
  cropShape?: "rect" | "circle";
  aspectRatio?: number;
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CroppedArea,
  fileName: string,
  isCircle: boolean = false
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  if (isCircle) {
    // Для круглого кропа создаем круглую маску
    ctx.beginPath();
    ctx.arc(
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      pixelCrop.width / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Canvas is empty");
        }
        const file = new File([blob], fileName, {
          type: "image/png",
          lastModified: Date.now(),
        });
        resolve(file);
      },
      "image/png",
      1
    );
  });
};

const ImageCropPreview: React.FC<ImageCropPreviewProps> = ({
  src,
  fileName,
  onCropComplete,
  onCancel,
  className = "",
  cropShape = "rect",
  aspectRatio,
}) => {
  const t = useTranslations("ImageCrop");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedArea | null>(null);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleApplyCrop = useCallback(async () => {
    if (!croppedAreaPixels) {
      return;
    }

    try {
      const croppedFile = await getCroppedImg(
        src,
        croppedAreaPixels,
        fileName,
        cropShape === "circle"
      );
      onCropComplete(croppedFile);
    } catch (error) {
      console.error("Error creating cropped image:", error);
    }
  }, [croppedAreaPixels, src, fileName, cropShape, onCropComplete]);

  return (
    <div className={`space-y-3 sm:space-y-4 w-full max-w-full ${className}`}>
      {/* Cropper Container */}
      <div className="relative w-full h-[300px] sm:h-[400px] bg-gray-900 rounded-lg overflow-hidden">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio || (cropShape === "circle" ? 1 : 4 / 3)}
          cropShape={cropShape === "circle" ? "round" : "rect"}
          showGrid={cropShape !== "circle"}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
        />
      </div>

      {/* Zoom Slider */}
      <div className="w-full px-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("labelZoom") || "Zoom"}
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-main"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end w-full">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="w-full sm:w-auto text-xs sm:text-sm py-2"
          >
            {t("buttonCancel")}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={handleApplyCrop}
          className="gap-1 bg-gold-main hover:bg-gold-main/90 text-white w-full sm:w-auto text-xs sm:text-sm py-2"
        >
          <Check className="h-3 w-3" />
          {t("buttonApply")}
        </Button>
      </div>
    </div>
  );
};

export default ImageCropPreview;
