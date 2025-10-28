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
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  const crumbs = generateBreadcrumbs(pathname, customLabels, t);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{t("Breadcrumb.home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map(({ href, label, isLast }) => (
          <React.Fragment key={href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
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
