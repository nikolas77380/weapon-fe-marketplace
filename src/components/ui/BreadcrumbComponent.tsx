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

interface BreadcrumbCustomClientProps {
  currentUser: UserProfile;
  className?: string;
}

const BreadcrumbComponent = ({ currentUser, className }: BreadcrumbCustomClientProps) => {
  const pathname = usePathname();
  const crumbs = generateBreadcrumbs(pathname);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={currentUser ? "/marketplace" : "/"}>Home</Link>
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
