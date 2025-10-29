import React from "react";
import BreadcrumbComponent from "./BreadcrumbComponent";
import { UserProfile } from "@/lib/types";

interface PageWrapperProps {
  children: React.ReactNode;
  currentUser?: UserProfile;
  breadcrumbClassName?: string;
  customLabels?: Record<string, string>;
}

const PageWrapper = ({
  children,
  currentUser,
  breadcrumbClassName = "mt-4 mb-10 px-4 sm:px-0",
  customLabels = {},
}: PageWrapperProps) => {
  return (
    <div className="w-full min-h-screen h-full">
      <div className="container flex flex-col mx-auto">
        <BreadcrumbComponent
          currentUser={currentUser}
          className={breadcrumbClassName}
          customLabels={customLabels}
        />
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
