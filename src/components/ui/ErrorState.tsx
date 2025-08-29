import React from "react";
import { CircleX } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
}

const ErrorState = ({
  title = "Error loading product...",
  message,
}: ErrorStateProps) => {
  return (
    <div className="flex justify-center items-center min-h-[600px]">
      <div className="text-center text-red-500">
        <p className="text-lg font-semibold mb-2 font-roboto flex items-center gap-3">
          <CircleX size={26} />
          <p className="font-semibold text-2xl">{title}</p>
        </p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;
