"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCroppedImg, getCroppedImgCircular } from "@/lib/cropUtils";

interface ImageCropPreviewProps {
  src: string;
  fileName: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel?: () => void;
  className?: string;
  cropShape?: "rect" | "circle";
  aspectRatio?: number;
}

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
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [aspect, setAspect] = useState<number>(
    aspectRatio || (cropShape === "circle" ? 1 : 4 / 3)
  );

  // Инициализация кропа при загрузке изображения
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = e.currentTarget;

      if (aspect) {
        const initialCrop = centerCrop(
          makeAspectCrop(
            {
              unit: "%",
              width: 90,
            },
            aspect,
            naturalWidth,
            naturalHeight
          ),
          naturalWidth,
          naturalHeight
        );
        setCrop(initialCrop);
      }
    },
    [aspect]
  );

  // Обновляем aspect при изменении aspectRatio или cropShape и пересоздаем кроп
  useEffect(() => {
    const newAspect = aspectRatio || (cropShape === "circle" ? 1 : 4 / 3);
    setAspect(newAspect);

    // Пересоздаем кроп с новым aspect ratio если изображение уже загружено
    if (imgRef.current && imgRef.current.complete) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          newAspect,
          naturalWidth,
          naturalHeight
        ),
        naturalWidth,
        naturalHeight
      );
      setCrop(initialCrop);
    }
  }, [aspectRatio, cropShape]);

  const handleApplyCrop = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    try {
      // При transform: scale() ReactCrop возвращает координаты относительно визуального размера
      // Но image.width не учитывает scale, нужно получить реальный визуальный размер
      const rect = imgRef.current.getBoundingClientRect();
      const displayWidth = rect.width;
      const displayHeight = rect.height;

      // Пересчитываем координаты кропа с учетом реального визуального размера
      const adjustedCrop: PixelCrop = {
        x: completedCrop.x,
        y: completedCrop.y,
        width: completedCrop.width,
        height: completedCrop.height,
        unit: "px",
      };

      const croppedFile =
        cropShape === "circle"
          ? await getCroppedImgCircular(
              imgRef.current,
              adjustedCrop,
              fileName,
              displayWidth,
              displayHeight
            )
          : await getCroppedImg(
              imgRef.current,
              adjustedCrop,
              fileName,
              displayWidth,
              displayHeight
            );
      onCropComplete(croppedFile);
    } catch (error) {
      console.error("Error creating cropped image:", error);
    }
  }, [completedCrop, fileName, cropShape, onCropComplete]);

  return (
    <div className={`space-y-3 sm:space-y-4 w-full max-w-full ${className}`}>
      {/* Cropper Container */}
      <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="w-full max-w-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop={cropShape === "circle"}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={src}
              style={{
                transform: `scale(${scale})`,
                maxWidth: "100%",
                maxHeight: "70vh",
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      </div>

      {/* Zoom Slider */}
      <div className="w-full px-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("labelZoom") || "Zoom"}
        </label>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
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
          disabled={!completedCrop}
          className="gap-1 bg-gold-main hover:bg-gold-main/90 text-white w-full sm:w-auto text-xs sm:text-sm py-2 disabled:opacity-60"
        >
          <Check className="h-3 w-3" />
          {t("buttonApply")}
        </Button>
      </div>
    </div>
  );
};

export default ImageCropPreview;
