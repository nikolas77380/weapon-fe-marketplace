"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, File } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImagesDropzoneProps {
  maxFiles?: number;
  maxSize?: number;
  acceptedFormats?: string[];
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

const ImagesDropzone: React.FC<ImagesDropzoneProps> = ({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  onFilesChange,
  className = "",
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`Maximum number of files: ${maxFiles}`);
        return;
      }

      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      const newPreviews = [...previews];
      acceptedFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target?.result as string);
            setPreviews([...newPreviews]);
          };
          reader.readAsDataURL(file);
        } else {
          newPreviews.push("pdf");
        }
      });

      if (onFilesChange) {
        onFilesChange(newFiles);
      }

      console.log("Files uploaded:", acceptedFiles);
      console.log("Total files:", newFiles);
    },
    [files, previews, maxFiles, onFilesChange]
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
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-blue-50"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">
            Please release files to download...
          </p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              Drag files here or click to select
            </p>
            <p className="text-sm text-gray-500">
              Maximum {maxFiles} file(s), up to{" "}
              {Math.round(maxSize / (1024 * 1024))} MB
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: JPEG, JPG, PNG, PDF
            </p>
          </div>
        )}
      </div>

      {/* List of downloaded files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">
            Uploaded files ({files.length}/{maxFiles}):
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
                          Loading...
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

                {/* Delete button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesDropzone;
