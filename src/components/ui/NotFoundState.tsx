import React from "react";

interface NotFoundStateProps {
  title?: string;
  message: string;
}

const NotFoundState = ({
  title = "Not found",
  message,
}: NotFoundStateProps) => {
  return (
    <div className="flex justify-center items-center min-h-[600px]">
      <div className="text-center">
        <p className="text-2xl font-semibold mb-2">{title}</p>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default NotFoundState;
