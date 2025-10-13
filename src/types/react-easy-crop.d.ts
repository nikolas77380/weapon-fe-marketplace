declare module "react-easy-crop" {
  import { ComponentType } from "react";

  export interface CropperProps {
    image: string;
    crop: { x: number; y: number };
    zoom: number;
    aspect?: number;
    cropShape?: "rect" | "round";
    showGrid?: boolean;
    onCropChange: (location: { x: number; y: number }) => void;
    onZoomChange: (zoom: number) => void;
    onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  }

  const Cropper: ComponentType<CropperProps>;
  export default Cropper;
}
