"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, File } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
}) => {
  const t = useTranslations("ImagesDropZone");
  const tCrop = useTranslations("ImageCrop");

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [tempImageData, setTempImageData] = useState<{
    file: File;
    preview: string;
  } | null>(null);

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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`${t("alertMaximumFiles")} ${maxFiles}`);
        return;
      }

      acceptedFiles.forEach((file) => {
        if (file.type.startsWith("image/") && enableCrop) {
          // For images with crop enabled, show crop interface immediately
          const reader = new FileReader();
          reader.onload = (e) => {
            setTempImageData({
              file,
              preview: e.target?.result as string,
            });
            // Set cropIndex to null for new files (not editing existing)
            setCropIndex(null);
          };
          reader.readAsDataURL(file);
        } else {
          // For non-images or when crop is disabled, add directly
          addFileDirectly(file);
        }
      });
    },
    [files, maxFiles, enableCrop, addFileDirectly, t]
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

          // Reset crop state after everything is done
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
        <div className="border-2 border-dashed border-gold-main rounded-lg p-1 min-[320px]:p-2 
        sm:p-4 bg-gold-main/5 mx-auto max-w-[95vw] flex flex-col items-center justify-center sm:max-w-lg md:max-w-3xl overflow-hidden">
          <h4 className="font-medium text-gray-700 mb-1 min-[320px]:mb-2 sm:mb-3 text-xs min-[320px]:text-sm sm:text-base truncate">
            {tCrop("titleCropImage")}: {tempImageData.file.name}
          </h4>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group border rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
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
                </div>

                {/* File name */}
                <p
                  className="text-xs text-gray-600 truncate mb-1"
                  title={file.name}
                >
                  {file.name}
                </p>

                {/* File size */}
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>

                {/* Action buttons */}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Crop button - only for images when crop is enabled */}
                  {/* {file.type.startsWith("image/") && enableCrop && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                      onClick={() => startCropMode(index)}
                      title={tCrop("tooltipCropImage")}
                    >
                      <Crop className="h-3 w-3" />
                    </Button>
                  )} */}

                  {/* Delete button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
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
