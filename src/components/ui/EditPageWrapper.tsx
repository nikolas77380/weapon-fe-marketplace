import React from "react";
import BreadcrumbComponent from "./BreadcrumbComponent";
import { UserProfile } from "@/lib/types";

interface PageWrapperProps {
  children: React.ReactNode;
  currentUser?: UserProfile;
  breadcrumbClassName?: string;
}

const EditPageWrapper = ({
  children,
  currentUser,
  breadcrumbClassName = "mt-4 mb-10",
}: PageWrapperProps) => {
  return (
    <div className="w-full min-h-screen h-full">
      <div className="container mx-auto flex flex-col">
        {currentUser && (
          <BreadcrumbComponent
            currentUser={currentUser}
            className={breadcrumbClassName}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default EditPageWrapper;
