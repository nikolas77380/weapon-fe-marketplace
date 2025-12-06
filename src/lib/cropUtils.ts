/**
 * Utility functions for image cropping
 */

import { Crop, PixelCrop } from "react-image-crop";

/**
 * Creates a cropped image canvas from the given image and crop area
 */
export function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  // Fill with white background for PNG transparency
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Canvas is empty");
        }
        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(file);
      },
      "image/jpeg",
      1 // Highest quality (no compression)
    );
  });
}

/**
 * Creates a cropped circular image from the given image and crop area
 */
export function getCroppedImgCircular(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  // Используем минимальную сторону кропа для создания квадратного холста
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;
  const size = Math.min(cropWidth, cropHeight);

  // Устанавливаем размеры холста
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  // Центр круга находится в центре холста
  const centerX = (size * pixelRatio) / 2;
  const centerY = (size * pixelRatio) / 2;
  const radius = (size * pixelRatio) / 2;

  // Создаем круглый клиппинг
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Рисуем изображение с учетом масштабирования и смещения
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    cropWidth,
    cropHeight,
    0,
    0,
    size * pixelRatio,
    size * pixelRatio
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
}

/**
 * Creates a default crop that covers the entire image
 */
export function makeDefaultCrop(): Crop {
  return {
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
}
