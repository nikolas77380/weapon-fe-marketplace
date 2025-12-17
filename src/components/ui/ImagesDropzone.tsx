"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, File } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import ImageCropPreview from "./ImageCropPreview";

interface ImagesDropzoneProps {
  maxFiles?: number;
  maxSize?: number;
  acceptedFormats?: string[];
  onFilesChange?: (files: File[]) => void;
  className?: string;
  enableCrop?: boolean;
  externalFiles?: File[];
  cropShape?: "rect" | "circle";
  aspectRatio?: number;
}

const ImagesDropzone: React.FC<ImagesDropzoneProps> = ({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  onFilesChange,
  className = "",
  enableCrop = false,
  externalFiles = [],
  cropShape = "rect",
  aspectRatio,
}) => {
  const t = useTranslations("ImagesDropZone");
  // const tCrop = useTranslations("ImageCrop");

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [tempImageData, setTempImageData] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  // Очередь файлов для кропа
  const [cropQueue, setCropQueue] = useState<
    Array<{ file: File; preview: string }>
  >([]);

  // Sync with external files - reset ONLY when external files were not empty before and became empty
  // This prevents clearing files immediately after adding them
  const prevExternalFilesLength = useRef(externalFiles.length);

  useEffect(() => {
    // Only clear if external files WERE present and NOW are empty (form was submitted and cleared)
    if (
      prevExternalFilesLength.current > 0 &&
      externalFiles.length === 0 &&
      files.length > 0
    ) {
      setFiles([]);
      setPreviews([]);
      setCropIndex(null);
      setTempImageData(null);
      setCropQueue([]);
    }

    prevExternalFilesLength.current = externalFiles.length;
  }, [externalFiles, files.length]);

  const addFileDirectly = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFiles = [...files, file];
          const newPreviews = [...previews, e.target?.result as string];

          setFiles(newFiles);
          setPreviews(newPreviews);

          if (onFilesChange) {
            onFilesChange(newFiles);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, add immediately
        const newFiles = [...files, file];
        const newPreviews = [...previews, "pdf"];

        setFiles(newFiles);
        setPreviews(newPreviews);

        if (onFilesChange) {
          onFilesChange(newFiles);
        }
      }
    },
    [files, previews, onFilesChange]
  );

  // Обработка очереди кропов - показываем следующий файл из очереди
  useEffect(() => {
    if (!tempImageData && cropQueue.length > 0 && enableCrop) {
      const nextInQueue = cropQueue[0];
      setTempImageData(nextInQueue);
      setCropQueue((prev) => prev.slice(1));
    }
  }, [tempImageData, cropQueue, enableCrop]);

  // Функция для загрузки preview изображения
  const loadImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`${t("alertMaximumFiles")} ${maxFiles}`);
        return;
      }

      const imagesToCrop: File[] = [];
      const filesToAddDirectly: File[] = [];

      // Разделяем файлы на те, что нуждаются в кропе, и те что можно добавить сразу
      acceptedFiles.forEach((file) => {
        if (file.type.startsWith("image/") && enableCrop) {
          imagesToCrop.push(file);
        } else {
          filesToAddDirectly.push(file);
        }
      });

      // Добавляем файлы, которые не требуют кропа
      filesToAddDirectly.forEach((file) => {
        addFileDirectly(file);
      });

      // Обрабатываем изображения для кропа
      if (imagesToCrop.length > 0) {
        try {
          // Загружаем все preview параллельно
          const previews = await Promise.all(
            imagesToCrop.map((file) => loadImagePreview(file))
          );

          const imagesWithPreviews = imagesToCrop.map((file, index) => ({
            file,
            preview: previews[index],
          }));

          if (tempImageData) {
            // Если уже есть активный кроп, добавляем в очередь
            setCropQueue((prev) => [...prev, ...imagesWithPreviews]);
          } else {
            // Если нет активного кропа, показываем первый файл и остальные в очередь
            setTempImageData(imagesWithPreviews[0]);
            if (imagesWithPreviews.length > 1) {
              setCropQueue(imagesWithPreviews.slice(1));
            }
          }
        } catch (error) {
          console.error("Error loading image previews:", error);
          toast.error(t("errorLoadingImages") || "Ошибка загрузки изображений");
        }
      }
    },
    [files, maxFiles, enableCrop, addFileDirectly, t, tempImageData]
  );

  const handleCropComplete = useCallback(
    (croppedFile: File) => {
      if (tempImageData) {
        // Create preview for cropped image first
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFiles = [...files, croppedFile];
          const newPreviews = [...previews, e.target?.result as string];

          setFiles(newFiles);
          setPreviews(newPreviews);

          if (onFilesChange) {
            onFilesChange(newFiles);
          }

          // Reset crop state - следующий файл из очереди покажется автоматически через useEffect
          setTempImageData(null);
          setCropIndex(null);
        };
        reader.readAsDataURL(croppedFile);
      }
    },
    [files, previews, tempImageData, onFilesChange]
  );

  const handleCropCancel = useCallback(() => {
    if (tempImageData && cropIndex === null) {
      // Add original file without cropping
      addFileDirectly(tempImageData.file);
    }
    // Reset crop state - следующий файл из очереди покажется автоматически через useEffect
    setTempImageData(null);
    setCropIndex(null);
  }, [tempImageData, addFileDirectly, cropIndex]);

  // const startCropMode = useCallback(
  //   (index: number) => {
  //     const file = files[index];
  //     const preview = previews[index];

  //     if (file.type.startsWith("image/") && preview !== "pdf") {
  //       setTempImageData({ file, preview });
  //       setCropIndex(index);
  //     }
  //   },
  //   [files, previews]
  // );

  const handleCropExistingComplete = useCallback(
    (croppedFile: File) => {
      if (cropIndex !== null && tempImageData) {
        // Update preview for cropped image first
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFiles = [...files];
          newFiles[cropIndex] = croppedFile;

          const newPreviews = [...previews];
          newPreviews[cropIndex] = e.target?.result as string;

          setFiles(newFiles);
          setPreviews(newPreviews);

          if (onFilesChange) {
            onFilesChange(newFiles);
          }

          // Reset crop state after everything is done
          setTempImageData(null);
          setCropIndex(null);
        };
        reader.readAsDataURL(croppedFile);
      }
    },
    [files, previews, cropIndex, tempImageData, onFilesChange]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);

      setFiles(newFiles);
      setPreviews(newPreviews);

      if (onFilesChange) {
        onFilesChange(newFiles);
      }

      console.log("File removed:", files[index]);
      console.log("Remaining files:", newFiles);
    },
    [files, previews, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: maxFiles > 1,
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Crop Interface - Show when tempImageData exists */}
      {tempImageData && (
        <div
          className="border-2 border-dashed border-gold-main rounded-lg p-1 min-[320px]:p-2 
        sm:p-4 bg-gold-main/5 mx-auto max-w-[95vw] flex flex-col items-center justify-center sm:max-w-lg md:max-w-3xl 
        overflow-hidden"
        >
          {cropQueue.length > 0 && (
            <div className="mb-2 text-sm text-gray-600 text-center px-2">
              {t("cropQueueInfo")}
              <span className="text-xs text-gray-500 block mt-1">
                {t("cropQueueHint")}
              </span>
            </div>
          )}
          <ImageCropPreview
            src={tempImageData.preview}
            fileName={tempImageData.file.name}
            onCropComplete={
              cropIndex !== null && cropIndex < files.length
                ? handleCropExistingComplete
                : handleCropComplete
            }
            onCancel={handleCropCancel}
            cropShape={cropShape}
            aspectRatio={aspectRatio}
          />
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-blue-50"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">{t("isDragActive")}</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              {t("isDragNonActive")}
            </p>
            <p className="text-sm text-gray-500">
              {t("titleMaximum")} {maxFiles} {t("titleFilesUpTo")}{" "}
              {Math.round(maxSize / (1024 * 1024))} MB
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t("titleSupportedFormats")} JPEG, JPG, PNG, PDF
            </p>
          </div>
        )}
      </div>

      {/* List of downloaded files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">
            {t("titleUploadedFiles")} ({files.length}/{maxFiles}):
          </h4>
          <div className="w-full flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative size-28 rounded p-2 bg-transparent"
              >
                {/* Preview */}
                <div className="relative w-full h-24 mb-2 rounded overflow-hidden">
                  {file.type.startsWith("image/") ? (
                    previews[index] && previews[index] !== "pdf" ? (
                      <Image
                        src={previews[index]}
                        alt={file.name}
                        fill
                        className="object-contain aspect-square w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          {t("buttonImageLoading")}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full bg-red-100 flex items-center justify-center">
                      <File className="h-8 w-8 text-red-500" />
                    </div>
                  )}
                  {/* Delete button - внутри контейнера превью */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 z-50 h-6 w-6 p-0 bg-destructive text-white rounded-sm flex items-center justify-center hover:bg-destructive/90 transition-colors"
                    style={{
                      opacity: 1,
                      visibility: "visible",
                      display: "flex",
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesDropzone;
