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
  fileName: string,
  displayWidth?: number,
  displayHeight?: number
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Используем реальный визуальный размер если передан (для учета transform: scale)
  const actualDisplayWidth = displayWidth ?? image.width;
  const actualDisplayHeight = displayHeight ?? image.height;

  // Пересчитываем координаты из визуального размера в натуральные пиксели
  const scaleX = image.naturalWidth / actualDisplayWidth;
  const scaleY = image.naturalHeight / actualDisplayHeight;

  // Пересчитываем координаты кропа в натуральные пиксели
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  console.log("Rect crop debug:", {
    crop,
    imageWidth: image.width,
    imageHeight: image.height,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    displayWidth: actualDisplayWidth,
    displayHeight: actualDisplayHeight,
    scaleX,
    scaleY,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
  });

  // Устанавливаем размеры холста БЕЗ pixelRatio для простоты
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.imageSmoothingQuality = "high";

  // Fill with white background for PNG transparency
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рисуем обрезанное изображение
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
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
  fileName: string,
  displayWidth?: number,
  displayHeight?: number
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Используем реальный визуальный размер если передан (для учета transform: scale)
  const actualDisplayWidth = displayWidth ?? image.width;
  const actualDisplayHeight = displayHeight ?? image.height;

  // Пересчитываем координаты из визуального размера в натуральные пиксели
  const scaleX = image.naturalWidth / actualDisplayWidth;
  const scaleY = image.naturalHeight / actualDisplayHeight;

  // Пересчитываем координаты кропа в натуральные пиксели
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  console.log("Crop debug:", {
    crop,
    imageWidth: image.width,
    imageHeight: image.height,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    displayWidth: actualDisplayWidth,
    displayHeight: actualDisplayHeight,
    scaleX,
    scaleY,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
  });

  // Для круглого кропа используем максимальную сторону, чтобы весь выбранный кроп вписывался
  const size = Math.max(cropWidth, cropHeight);

  // Устанавливаем размеры холста (квадрат для круга) БЕЗ pixelRatio для простоты
  canvas.width = size;
  canvas.height = size;

  ctx.imageSmoothingQuality = "high";

  // Центр круга находится в центре холста
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2;

  // Создаем круглый клиппинг
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Вычисляем смещение для центрирования кропа в квадратном холсте
  const offsetX = (size - cropWidth) / 2;
  const offsetY = (size - cropHeight) / 2;

  console.log("Draw debug:", {
    size,
    offsetX,
    offsetY,
    drawWidth: cropWidth,
    drawHeight: cropHeight,
  });

  // Рисуем изображение - весь выбранный кроп будет виден в круге
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    offsetX,
    offsetY,
    cropWidth,
    cropHeight
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
