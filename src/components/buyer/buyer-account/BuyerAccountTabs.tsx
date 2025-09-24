import React from "react";
import { UserProfile } from "@/lib/types";
import BuyerTabsMobile from "./BuyerTabsMobile";
import BuyerTabsDesktop from "./BuyerTabsDesktop";

interface BuyerAccountTabsProps {
  currentUser: UserProfile;
}

const BuyerAccountTabs = ({ currentUser }: BuyerAccountTabsProps) => {
  return (
    <>
      <BuyerTabsMobile currentUser={currentUser} />
      <BuyerTabsDesktop currentUser={currentUser} />
    </>
  );
};

export default BuyerAccountTabs;
