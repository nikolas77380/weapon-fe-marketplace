import React from "react";

interface LoadingStateProps {
  title?: string;
}

const LoadingState = ({ title = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="flex justify-center items-center min-h-[600px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-6"></div>
        <p className="text-lg font-medium text-orange-500 font-roboto">
          {title}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
