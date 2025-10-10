/**
 * Utility functions for image cropping
 */

import { Crop } from "react-image-crop";

/**
 * Creates a cropped image canvas from the given image and crop area
 */
export function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
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
  crop: Crop,
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

  // Use the shortest side to create a square
  const size = Math.min(crop.width, crop.height);
  canvas.width = size * pixelRatio * scaleX;
  canvas.height = size * pixelRatio * scaleY;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  const radius = (size * scaleX) / 2;
  const centerX = (size * scaleX) / 2;
  const centerY = (size * scaleY) / 2;

  // Create a circular mask
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw an image inside a circle
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    size * scaleX,
    size * scaleY,
    0,
    0,
    size * scaleX,
    size * scaleY
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
