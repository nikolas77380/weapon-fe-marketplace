import React from "react";
import BreadcrumbCustomClient from "./BreadcrumbCustomClient";
import { requireAuth } from "@/lib/server-auth";

const BreadcrumbCustom = async () => {
  const currentUser = await requireAuth();

  return <BreadcrumbCustomClient currentUser={currentUser} />;
};

export default BreadcrumbCustom;
