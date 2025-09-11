"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";
import { UserProfile } from "@/lib/types";

interface BreadcrumbComponentProps {
  currentUser?: UserProfile;
  className?: string;
  customLabels?: Record<string, string>;
}

const BreadcrumbComponent = ({
  className,
  customLabels = {},
}: BreadcrumbComponentProps) => {
  const pathname = usePathname();
  const crumbs = generateBreadcrumbs(pathname, customLabels);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map(({ href, label, isLast, isClickable }) => (
          <React.Fragment key={href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast || !isClickable ? (
                <BreadcrumbPage className={!isClickable ? "text-gray-500" : ""}>
                  {label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
