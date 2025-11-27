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
import { cn } from "@/lib/utils";

interface IntermediateCrumb {
  href: string;
  label: string;
}

interface BreadcrumbComponentProps {
  currentUser?: UserProfile;
  className?: string;
  customLabels?: Record<string, string>;
  intermediateCrumbs?: IntermediateCrumb[];
}

const BreadcrumbComponent = ({
  className,
  customLabels = {},
  intermediateCrumbs = [],
}: BreadcrumbComponentProps) => {
  const pathname = usePathname();
  const t = useTranslations();
  const crumbs = generateBreadcrumbs(pathname, customLabels, t);

  // Insert intermediate crumbs before the last crumb
  const allCrumbs = [...crumbs];
  const lastCrumb = allCrumbs.pop();

  // Normalize all crumbs to have the same structure
  const normalizedCrumbs = [
    ...allCrumbs.map((crumb) => ({
      href: crumb.href,
      label: crumb.label,
      isIntermediate: false,
    })),
    ...intermediateCrumbs.map((crumb) => ({
      href: crumb.href,
      label: crumb.label,
      isIntermediate: true,
    })),
    {
      href: lastCrumb!.href,
      label: lastCrumb!.label,
      isIntermediate: false,
    },
  ];

  return (
    <Breadcrumb className={cn(className, "ml-3")}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{t("Breadcrumb.home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {normalizedCrumbs.map(({ href, label, isIntermediate }, index) => {
          const isLast = index === normalizedCrumbs.length - 1;
          const truncateClass = isIntermediate
            ? "max-w-[120px] md:max-w-none truncate"
            : isLast
            ? "max-w-[200px] sm:max-w-[300px] md:max-w-none truncate"
            : "truncate";
          return (
            <React.Fragment key={`${href}-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={truncateClass}>
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className={truncateClass}>
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
